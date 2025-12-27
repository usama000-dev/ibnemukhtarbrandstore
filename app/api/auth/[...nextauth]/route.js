// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { User } from "@/models/User";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const TOKEN_EXPIRY = "7d"; // ✅ single place to manage

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "openid email profile", // ✅ ensure email returns
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // console.log("🟢 signIn callback started");

      if (account.provider !== "google") return true;

      try {
        if (mongoose.connection.readyState !== 1) {
          await mongoose.connect(process.env.MONGODB_URI);
          // console.log("✅ MongoDB connected");
        }

        if (!user.email) {
          // console.log("❌ Google did not return an email");
          return false;
        }

        let existingUser = await User.findOne({ email: user.email });

        // ✅ CREATE NEW USER
        if (!existingUser) {
          // console.log("🆕 Creating user for first time...");

          const token = jwt.sign(
            {
              email: user.email,
              name: user.name,
              role: "user",
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: TOKEN_EXPIRY }
          );

          await User.create({
            email: user.email,
            name: user.name || "",
            roll: "user", // ✅ using correct DB field
            token,
          });

          return true;
        }

        // ✅ EXISTING USER
        // console.log("✅ Existing user:", existingUser.email);

        let isTokenValid = true;

        try {
          jwt.verify(existingUser.token, process.env.JWT_SECRET_KEY);
        } catch (err) {
          isTokenValid = false;
          // console.log("⚠️ Token expired");
        }

        // ✅ If token expired and user is ADMIN → logout & block
        if (!isTokenValid && existingUser.roll === "admin") {
          // console.log("⛔ Admin token expired → blocking login");
          return false;
        }

        // ✅ If token expired and user is NORMAL → auto-generate new token
        if (!isTokenValid && existingUser.roll !== "admin") {
          // console.log("✅ Normal user → new auto token");

          const newToken = jwt.sign(
            {
              email: existingUser.email,
              name: existingUser.name,
              role: existingUser.roll, // ✅ consistent
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: TOKEN_EXPIRY }
          );

          existingUser.token = newToken;
          await existingUser.save();
        }

        return true;
      } catch (error) {
        // console.error("❌ signIn error:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await User.findOne({ email: user.email });

        token.accessToken = dbUser?.token || "";
        token.role = dbUser?.roll || "user"; // ✅ consistent
        token.email = dbUser?.email || "";
      }

      if (!user && !token?.email) return {};

      return token;
    },

    async session({ session, token }) {
      if (token?.accessToken) {
        session.user = {
          accessToken: token.accessToken,
          role: token.role,
          email: token.email,
        };
      } else {
        delete session.user;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };

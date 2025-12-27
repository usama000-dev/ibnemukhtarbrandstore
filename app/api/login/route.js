import connectDb from "@/middleware/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const POST = async (req) => {
  try {
    await connectDb(); // Connect to MongoDB
    const body = await req.json(); // Parse request body
    // console.log(body);

    if (!body.email || !body.password) {
      return new Response(
        JSON.stringify({ message: "Email and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = await User.findOne({ email: body.email }).lean();
    // console.log("user: ", user);
    // console.log(
    //   "body password: ",
    //   body.password,
    //   "user password: ",
    //   user.password
    // );
    if (!user || !user.password) {
      return new Response(
        JSON.stringify({ message: "Invalid email or password" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
   

    const isPasswordValid = await bcrypt.compare(body.password, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = jwt.sign(
      {
        user: user._id,
        email: user.email,
        name: user.name,
        role: user.roll,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    return new Response(
      JSON.stringify({
        message: "Login successful",
        name: user.name,
        token,
        roll: user.roll,
        email: user.email,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

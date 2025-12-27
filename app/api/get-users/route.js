import { NextResponse } from "next/server";
import connectDb from "@/middleware/mongoose";
import jwt from "jsonwebtoken";
import { User } from "@/models/User";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    const token = body.token;

    if (!token)
      return NextResponse.json({ error: "Token missing" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const userEmail = decoded.email;
    const user = await User.findOne({ email: userEmail }).lean();
    // console.log(user);
    // console.log(user.roll !== "admin","admin or not");
    
    if (user.roll !== "admin") {
      return NextResponse.json(
        { error: "Access denide by admin" },
        { status: 401 }
      );
    }
    console.log('befor get data');
    
    const users = await User.find().lean();
    console.log(users);
    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

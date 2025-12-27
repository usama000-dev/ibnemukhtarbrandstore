import connectDb from "@/middleware/mongoose";
import { User } from "@/models/User";

export const POST = async (req) => {
  try {
    await connectDb(); // Now works without req/res
    const body = await req.json();
    console.log(body);

    const updateData = {};
    if (body.name) updateData.name = body.name;
    if (body.phone) updateData.phone = body.phone;
    if (body.city) updateData.city = body.city;
    if (body.state) updateData.state = body.state;
    if (body.address) updateData.address = body.address;
    console.log(updateData, "befor updated");

    if (Object.keys(updateData).length === 0) {
      return new Response("No valid fields to update", { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: body.email },
      { $set: updateData },
      { new: true }
    );
    console.log(updatedUser, "after updated");

    if (!updatedUser) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify({ updatedUser }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("âŒ Error in GET /api/update-user:", error.message);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
};

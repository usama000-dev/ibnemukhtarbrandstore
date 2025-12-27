import connectDb from "@/middleware/mongoose";
import { Product } from "@/models/Product";

export const GET = async () => {
  try {
    await connectDb();

    // Sort by availability in descending order (you can use a "sales" field too)
    const popularProducts = await Product.find().sort({ availability: -1 }).limit(10);

    return new Response(JSON.stringify({ popularProducts }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("âŒ Error in GET /api/popularProducts:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: error.message }),
      { status: 500 }
    );
  }
};

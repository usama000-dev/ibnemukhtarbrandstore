import connectDb from "@/middleware/mongoose";
import { Product } from "@/models/Product";

export const POST = async (req) => {
  try {
    await connectDb(); // MongoDB se connection

    const body = await req.json(); // request body ko parse karna
    const { _id, ...updateData } = body; // body se _id ko alag nikal ke baaki data update karenge

    // Sanitize videoUrl - convert empty strings to null to prevent validation errors
    if (updateData.videoUrl !== undefined) {
      updateData.videoUrl = updateData.videoUrl && updateData.videoUrl.trim() !== ''
        ? updateData.videoUrl.trim()
        : null;
    }

    // Product ko update karna by _id
    const updatedProduct = await Product.findByIdAndUpdate(_id, updateData, { new: true });

    if (!updatedProduct) {
      return new Response(JSON.stringify({ error: "Product not found" }), {
        status: 404
      });
    }

    return new Response(JSON.stringify({ message: "Product updated successfully", product: updatedProduct }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ error: "Failed to update product" }), {
      status: 500
    });
  }
};

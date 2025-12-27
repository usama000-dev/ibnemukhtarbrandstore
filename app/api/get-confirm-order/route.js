import { Proof } from "@/models/Proof";
import { Order } from "@/models/Order";
import connectDb from "../../../middleware/mongoose";

export const GET = async () => {
  try {
    await connectDb();

    // Get all proofs (payment proofs)
    const proofs = await Proof.find();
    
    // Get complete order data for each proof
    const ordersWithDetails = await Promise.all(
      proofs.map(async (proof) => {
        const order = await Order.findOne({ orderId: proof.orderId });
        return {
          ...proof.toObject(),
          products: order?.products || {},
          originalAmount: order?.amount || proof.amount,
          deliveryCharge: order?.deliveryCharge || 0,
          discountValue: order?.discountValue || 0,
          couponCode: order?.couponCode || "",
          deliveryMethod: order?.deliveryMethod || "",
          address: order?.address || "",
          city: order?.city || "",
          state: order?.state || "",
          phone: order?.phone || "",
        };
      })
    );
    
    return new Response(JSON.stringify({ proofs: ordersWithDetails }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("âŒ Error in GET /api/get-confirm-order:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: error.message }),
      { status: 500 }
    );
  }
};

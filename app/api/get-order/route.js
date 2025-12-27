import { Order } from "@/models/Order";
import connectDb from "../../../middleware/mongoose";

export const GET = async (req) => {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    // console.log("orderId :: ", orderId);

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: "Order ID is required" }),
        { status: 400 }
      );
    }

    const order = await Order.findOne({ orderId });
// console.log("order :: ", order);

    if (!order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ order }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("âŒ Error in GET /api/get-order:", error.message);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
};

export const POST = async (req) => {
  try {
    await connectDb();
    const body = await req.json();

    const order = await Order.findOne({ orderId: body.orderId });

    if (!order) {
      return new Response(
        JSON.stringify({ error: "Order not found" }),
        { status: 404 }
      );
    }

    const amount = order.amount;
    const orderId = order.orderId;
    const id = order._id;

    return new Response(JSON.stringify({ amount, orderId, id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("âŒ Error in POST /api/get-order:", error.message);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        message: error.message,
      }),
      { status: 500 }
    );
  }
};

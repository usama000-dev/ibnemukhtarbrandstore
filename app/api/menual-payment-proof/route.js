import { EmailService } from "@/services/emailService";
import connectDb from "@/middleware/mongoose";
import { Order } from "@/models/Order";
import { Proof } from "@/models/Proof";
import cloudinary from "@/utils/cloudinory";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectDb();

    const formData = await req.formData();
    const orderId = formData.get("orderId");
    const imageFile = formData.get("image");

    const order = await Order.findOne({ orderId });
    if (!order) {
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
      });
    }

    // Image buffer banana
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cloudinary upload
    const uploadedImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "payment_proofs" }, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        })
        .end(buffer);
    });

    const proof = new Proof({
      orderId,
      email: order.email,
      proofimgurl: uploadedImage.secure_url,
      amount: order.amount,
      name: order.name,
    });

    await proof.save();
    try {
      await EmailService.sendEmail(
        order.email,
        "ðŸ“¦ Order Received - Awaiting Confirmation",
        `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <img src="https://res.cloudinary.com/do58gkhav/image/upload/v1748369684/payment_proofs/nqwzd4hhjq5l37cwrlxj.jpg" alt="Champion Choice Logo" style="border-radius: 50%; max-width: 150px; display: block; margin: auto;"/>

      <h2 style="color: #DD8560; text-align: center;">ðŸ› ï¸  Order Received!</h2>

      <p>Hi <strong>${order.name}</strong>,</p>

      <p>Thank you for shopping with <strong>Champion-Choice</strong>! ðŸŽ‰</p>

      <p>Your order has been received and is currently under review. Our admin team is confirming the order details and will approve it shortly.</p>

      <p style="margin-top: 20px; font-weight: bold;">ðŸ“¦ Order ID: <code>${order.orderId}</code></p>

      <p>Weâ€™ll notify you as soon as your order is confirmed. Stay tuned!</p>

      <hr style="margin: 30px 0;" />
      <p style="font-size: 12px; color: #777; text-align: center;">
        Champion-Choice Support Team<br/>
        ðŸ“§ championhub00@gmail.com
      </p>
           <p style="font-size: 12px; color: #333; text-align: center;">
If you received this email in your spam folder, please mark it as "Not Spam" so you don't miss updates.</p>

    </div>
  `,
        "Order received and under review."
      );
    } catch (error) {
      console.error("Error: ", error);
      return NextResponse.json(
        { error: "Some error sending email" },
        { status: 409 }
      );
    }
    return new Response(
      JSON.stringify({
        message: "Order placed successfully, please wait for admin",
        proof,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ error: "Failed to place order" }), {
      status: 500,
    });
  }
};

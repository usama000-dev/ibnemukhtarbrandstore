import { EmailService } from "@/services/emailService";
import connectDb from "@/middleware/mongoose";
import { Coupon } from "@/models/Coupon";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Proof } from "@/models/Proof";
import { Uniform } from "@/models/uniform.models";
import cloudinary from "@/utils/cloudinory";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    await connectDb();
    const body = await req.json();
    // console.log("body: ", body);

    if (body?.status === "paid") {
      //payment approved logic

      const proff = await Proof.findOne({ orderId: body.orderId });
      const order = await Order.findOneAndUpdate(
        { orderId: body.orderId },
        {
          status: body.status,
          deliveryStatus: body.deliveryStatus,
          imgUrl: proff.proofimgurl,
        }
      );
      await Proof.findOneAndDelete({ orderId: proff.orderId });
      if (order?.couponCode) {
        const couponbefor = await Coupon.findOne(
          { code: order.couponCode.toUpperCase() })
        // console.log("coupon after used: ", couponbefor.maxUses);

        const coupon = await Coupon.findOneAndUpdate(
          { code: order.couponCode.toUpperCase(), maxUses: { $gt: 0 } }, // prevent going below 0
          { $inc: { maxUses: -1 } }
        );
        // console.log("coupon after used: ", coupon.maxUses);


        if (!coupon) {
          console.warn(`Coupon '${order.couponCode}' not found or has no remaining uses.`);
        }
      }

      try {
        await EmailService.sendEmail(
          order.email,
          "âœ… Order Confirmed - Details Inside",
          `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <img src="https://res.cloudinary.com/do58gkhav/image/upload/v1748369684/payment_proofs/nqwzd4hhjq5l37cwrlxj.jpg" alt="Champion Choice Logo" style="border-radius: 50%; max-width: 150px; display: block; margin: auto;"/>
        
              <h2 style="color: #DD8560; text-align: center;">ðŸŽ‰ Your Order is Confirmed!</h2>
        
              <p>Hi <strong>${order.name}</strong>,</p>
        
              <p>Good news! Your order has been successfully confirmed. Here's what you ordered:</p>
        
              <ul>
                ${Object.entries(order.products)
            .map(
              ([key, product]) =>
                `<li><strong>${product.title || product.name
                }</strong> - Qty: ${product.qty}</li>`
            )
            .join("")}
              </ul>
        
              <p style="margin-top: 20px;">
                You can view full details of your order by clicking the button below:
              </p>
        
              <p style="text-align: center; margin: 20px 0;">
                <a href="${process.env.NEXT_PUBLIC_HOST}/order/${order._id
          }" style="background-color: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  View Your Order
                </a>
              </p>
        
              <p>Thanks for trusting Champion-Choice. Weâ€™re getting your gear ready! ðŸ¥‹</p>
        
              <hr style="margin: 30px 0;" />
              <p style="font-size: 12px; color: #777; text-align: center;">
                Champion-Choice Support Team<br/>
                ðŸ“§ championhub00@gmail.com
              </p>
            </div>
          `,
          "Your order is confirmed."
        );
      } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json(
          { error: "Some error sending email" },
          { status: 409 }
        );
      }
      console.log("order is confirmed by champion choice team");

      return new Response(
        JSON.stringify({
          message: "Order approved successfully",
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (body?.formData?.deliveryStatus === "delivering") {
      //delivery on the way logic
      try {
        const formData = body.formData;
        const orderId = formData.orderId;
        const imageFile = formData.image;
        const deliveryStatus = formData.deliveryStatus;
        // console.log("image from frontend: ", imageFile);
        console.log("orderId from frontend: ", orderId);
        console.log("deliverystatus from frontend: ", deliveryStatus);

        // Convert the image file to arrayBuffer â†’ buffer
        const base64Data = imageFile.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");

        const uploadedImage = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "delivery-Voucher" }, (err, result) => {
              if (err) return reject(err);
              resolve(result);
            })
            .end(buffer);
        });
        // console.log("uploaded voucher url: ", uploadedImage.secure_url);

        // Update in DB
        await Order.findOneAndUpdate(
          { orderId: orderId },
          {
            $set: {
              deliveryVoucher: uploadedImage.secure_url,
              deliveryStatus: deliveryStatus,
            },
          },
          { new: true } // returns updated document
        );
      } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json(
          { error: "Some error uploading voucher" },
          { status: 400 }
        );
      }
      const order = await Order.findOne({ orderId: body.formData.orderId }); // FIXing latter

      const products = order.products;
      if (!products)
        return NextResponse.json(
          { error: "Proudcts not found" },
          { status: 404 }
        );

      for (let slug in products) {
        const item = products[slug];
        // ðŸ‘‰ Check if itâ€™s a uniform product (by checking if it has uniformNumberFormat)
        if (item.uniformNumberFormat) {
          await Uniform.deleteOne({
            uniformNumberFormat: item.uniformNumberFormat,
          });
        }

        // ðŸ›’ Reduce stock for normal product (and uniform too if present in Product collection)
        const product = await Product.findOneAndUpdate(
          { slug: slug },
          { $inc: { availability: -item.qty } },
          { new: true }
        );

        if (!product) {
          continue;
        }
      }
      try {
        await EmailService.sendEmail(
          order.email,
          "ðŸ“¦ Your Order Has Been Shipping - Thank You!",
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <img src="https://res.cloudinary.com/do58gkhav/image/upload/v1748369684/payment_proofs/nqwzd4hhjq5l37cwrlxj.jpg" alt="Champion Choice Logo" style="border-radius: 50%; max-width: 150px; display: block; margin: auto;"/>
      
            <h2 style="color: #28a745; text-align: center;">âœ… Your Order Has Been Shipping!</h2>
      
            <p>Hi <strong>${order.name}</strong>,</p>
      
            <p>Weâ€™re happy to let you know that your order has been successfully Shipping. Please wait for the delivery. Your order has been shipping in 3-5 working days. Hope you loved your gear!</p>
      
            <h3 style="margin-top: 20px;">ðŸ› ï¸  Order Summary:</h3>
            <ul style="padding-left: 20px;">
              ${Object.entries(order.products)
            .map(
              ([key, product]) =>
                `<li><strong>${product.title || product.name
                }</strong> - Qty: ${product.qty}</li>`
            )
            .join("")}
            </ul>
      
            <p style="margin-top: 20px;">
              If you have any issues or feedback, feel free to reply to this email. We'd love to hear from you.
            </p>
      
            <p style="text-align: center; margin: 20px 0;">
              <a href="${process.env.NEXT_PUBLIC_HOST}/order/${order._id}" 
                 style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                View Order Details
              </a>
            </p>
      
            <p>Thanks for choosing <strong>Champion-Choice</strong>. We appreciate your trust and look forward to serving you again!</p>
      
            <hr style="margin: 30px 0;" />
            <p style="font-size: 12px; color: #777; text-align: center;">
              Champion-Choice Support Team<br/>
              ðŸ“§ championhub00@gmail.com
            </p>
          </div>
        `,
          "Your order is shipping."
        );
      } catch (error) {
        console.error("Error: ", error);
        return NextResponse.json(
          { error: "Some error sending email" },
          { status: 409 }
        );
      }
    }
    // only run if order delivered
    if (body?.deliveryStatus === "deliverd") {
      //order delivered logic
      body?.orderId
      console.log("body: ", body);

      let order = await Order.findOneAndUpdate(
        { orderId: body?.orderId },
        { deliveryStatus: body.deliveryStatus },
        { new: true, runValidators: true }
      );
      console.log("order : ", order);

      try {
        await EmailService.sendEmail(
          order.email,
          "ðŸ“¦ Your Order Has Been Delivered - Thank You!",
          `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <img src="https://res.cloudinary.com/do58gkhav/image/upload/v1748369684/payment_proofs/nqwzd4hhjq5l37cwrlxj.jpg" alt="Champion Choice Logo" style="border-radius: 50%; max-width: 150px; display: block; margin: auto;"/>
      
            <h2 style="color: #28a745; text-align: center;">âœ… Your Order Has Been Delivered!</h2>
      
            <p>Hi <strong>${order.name}</strong>,</p>
      
            <p>Weâ€™re happy to let you know that your order has been successfully delivered. Hope you loved your gear!</p>
      
            <h3 style="margin-top: 20px;">ðŸ› ï¸  Order Summary:</h3>
            <ul style="padding-left: 20px;">
              ${Object.entries(order.products)
            .map(
              ([key, product]) =>
                `<li><strong>${product.title || product.name
                }</strong> - Qty: ${product.qty}</li>`
            )
            .join("")}
            </ul>
      
            <p style="margin-top: 20px;">
              If you have any issues or feedback, feel free to reply to this email. We'd love to hear from you.
            </p>
      
            <p style="text-align: center; margin: 20px 0;">
              <a href="${process.env.NEXT_PUBLIC_HOST}/order/${order._id}" 
                 style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                View Order Details
              </a>
            </p>
      
            <p>Thanks for choosing <strong>Champion-Choice</strong>. We appreciate your trust and look forward to serving you again!</p>
      
            <hr style="margin: 30px 0;" />
            <p style="font-size: 12px; color: #777; text-align: center;">
              Champion-Choice Support Team<br/>
              ðŸ“§ championhub00@gmail.com
            </p>
          </div>
        `,
          "Your order has been delivered."
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
          message: "Order deliverd marked successfully", order
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Order updated successfully",
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
    return new Response(JSON.stringify({ error: "Failed to process order" }), {
      status: 500,
    });
  }
};

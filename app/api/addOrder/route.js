import { Product } from "@/models/Product";
import { Uniform } from "@/models/uniform.models";
import cloudinary from "@/utils/cloudinory";

import connectDb from "../../../middleware/mongoose";
import { Order } from "../../../models/Order";

export async function POST(req) {
  try {
    await connectDb();

    const formData = await req.formData();
    const email = formData.get("email");
    const name = formData.get("name");
    const address = formData.get("address");
    const amount = formData.get("amount");
    const city = formData.get("city");
    const phone = formData.get("phone");
    const slug = formData.get("slug");
    const size = formData.get("size");
    const color = formData.get("color");
    const productNumberRaw = formData.get("productNumber");
    const qty = formData.get("qty");
    const imgFile = formData.get("images");
    const oid = "#" + Math.floor(1000000 + Math.random() * 9000000).toString();

    const processOrderData = async ({ qty, productNumberRaw, color, size, slug }) => {
      const products = {};

      if (slug) {
        const product = await Product.findOne({ slug });
        if (!product) throw new Error("Product not found");

        if (product.size !== size || product.color !== color)
          throw new Error("Size or color mismatch");

        if (product.availability < parseInt(qty))
          throw new Error("Not enough quantity available");

        await Product.updateOne(
          { slug },
          { $inc: { availability: -parseInt(qty) } }
        );

        products[product.slug] = {
          title: product.title,
          size: product.size,
          color: product.color,
          qty: parseInt(qty),
          price: product.price,
        };
      } else if (productNumberRaw) {
        const productNumbersArray = productNumberRaw
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p);

        const uniformFindPromises = productNumbersArray.map((number) =>
          Uniform.findOne({ uniformNumberFormat: number })
        );
        const uniforms = await Promise.all(uniformFindPromises);

        for (let i = 0; i < productNumbersArray.length; i++) {
          const number = productNumbersArray[i];
          const uniform = uniforms[i];

          if (!uniform) {
            console.warn(`âš ï¸ Uniform not found for: ${number}`);
            products[number] = {
              uniformNumberFormat: number,
              status: "Not found in DB but payment ok",
            };
            continue;
          }

          products[uniform.uniformNumberFormat] = {
            name: uniform.name,
            company: uniform.company,
            size: uniform.size,
            category: uniform.category,
            upperColor: uniform.upperColor,
            trowserColor: uniform.trowserColor,
            seneiority: uniform.seneiority,
            imageUrl: uniform.imageUrl,
            style: uniform.style,
            uniformNumberFormat: uniform.uniformNumberFormat,
            neckStyle: uniform.neckStyle,
            poomseOrNot: uniform.poomseOrNot,
          };

          await Uniform.deleteOne({ uniformNumberFormat: number });
        }
      }

      return products;
    };

    const result = await processOrderData({
      qty,
      productNumberRaw,
      color,
      size,
      slug,
    });

    let imgUrl = "";
    if (imgFile && imgFile.size > 0) {
      const arrayBuffer = await imgFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      imgUrl = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "payment_proofs" },
          (err, result) => {
            if (err) reject(err);
            else resolve(result.secure_url);
          }
        ).end(buffer);
      });
    }

    const order = new Order({
      email,
      name,
      orderId: oid,
      paymentInfo: "",
      products: result,
      address,
      city,
      state: "",
      amount,
      phone,
      status: "paid",
      deliveryStatus: "delivering",
      paymentMethod: "payment by admin",
      imgUrl,
    });

    console.time("orderSave");
    await order.save();
    console.timeEnd("orderSave");

    // ðŸš€ Email send in background (don't await)
    (async () => {
      try {
        await EmailService.sendEmail(
          order.email,
          "âœ… Order Delivering - Details Inside",
          `
            <div style="font-family: Arial; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <img src="https://res.cloudinary.com/do58gkhav/image/upload/v1748369684/payment_proofs/nqwzd4hhjq5l37cwrlxj.jpg" style="border-radius: 50%; max-width: 150px; display: block; margin: auto;" />
              <h2 style="color: #DD8560; text-align: center;">ðŸŽ‰ Your Order is Delivering!</h2>
              <p>Hi <strong>Dear ${order.name}</strong>,</p>
              <p>Hereâ€™s what you ordered:</p>
              <ul>
                ${Object.entries(order.products)
            .map(
              ([key, product]) =>
                `<li><strong>${product.title || product.company}</strong> - Qty: ${product.qty || 1}</li>`
            )
            .join("")}
              </ul>
              <p style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_HOST}/order/${order._id}" style="background-color: black; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                  View Your Order
                </a>
              </p>
              <p style="font-size: 12px; text-align: center; color: #777;">
                Champion-Choice Support Team<br/>
                ðŸ“§ championhub00@gmail.com
              </p>
            </div>
          `,
          "Your order is delivering. Please check your account for details."
        );
      } catch (error) {
        console.error("Email send failed:", error);
      }
    })();

    return new Response(JSON.stringify({ message: "Order placed successfully!" }), {
      status: 201,
    });
  } catch (error) {
    console.error("Order POST error:", error);
    return new Response(JSON.stringify({ error: "Failed to place order!" }), {
      status: 500,
    });
  }
}

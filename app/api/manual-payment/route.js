import connectDb from "@/middleware/mongoose";
import { Coupon } from "@/models/Coupon";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { Uniform } from "@/models/uniform.models";
import { UniformFlag } from "@/models/uniformFlag.models";
import CalculatePrice from "@/utils/priceCalculator";

export const POST = async (req) => {
  try {
    console.log("#######################################################");
    console.log("enter in try block");
    console.log("#######################################################");

    await connectDb();
    const body = await req.json();
    console.log("#######################################################");
    console.log("after body parsing: ", body);
    console.log("#######################################################");
    const products = {}; // âœ… Use object instead of array
    let serverTotal = 0;
    let discountAmount = 0;

    for (let slug in body.cart) {
      const item = body.cart[slug];
      console.log("#######################################################");
      console.log("in for loop: ", item);
      console.log("#######################################################");
      let product = await Product.findOne({ slug });
      console.log("#######################################################");
      console.log("product menual payment line 22: ", product);
      console.log("#######################################################");

      if (!product) {
        console.log("#######################################################");
        console.log("in uniform : ", slug);
        console.log("#######################################################");
        const uniform = await Uniform.findOne({ uniformNumberFormat: slug });
        console.log("#######################################################");
        console.log("uniform menual payment line 22: ", uniform);
        console.log("#######################################################");

        if (!uniform) {
          return new Response(
            JSON.stringify({
              error: `Item "${slug}" not found in Product or Uniform.`,
            }),
            { status: 404 }
          );
        }
        console.log("#######################################################");

        console.log(
          "size: ",
          uniform.size,
          "category: ",
          uniform.category,
          "poomseOrNot: ",
          uniform.poomseOrNot
        );
        console.log("#######################################################");

        // Merge UniformFlag fields if present
        if (uniform.poomseOrNot === "poomse") {
          const flag = await UniformFlag.findOne({
            size: uniform.size,
            category: uniform.category,
            poomseOrNot: uniform.poomseOrNot,
          });
        }
        const flag = await UniformFlag.findOne({
          size: uniform.size,
          category: uniform.category,
        });

        console.log("#######################################################");

        console.log(
          "flag Flashsale: (",
          flag.flashSale,
          ") flag FlashSALE start: (",
          flag.flashSaleStart,
          ") flag FlashSaleEnd: (",
          flag.flashSaleEnd,
          ") flag FlashPrice: (",
          flag.flashSalePrice,
          ")"
        );
        console.log("#######################################################");

        if (flag) {
          uniform.flashSale = flag.flashSale;
          uniform.flashSalePrice = flag.flashSalePrice;
          uniform.flashSaleStart = flag.flashSaleStart;
          uniform.flashSaleEnd = flag.flashSaleEnd;
          uniform.discountPercent = flag.discountPercent;
        }
        // Robust price calculation for uniforms
        let basePrice = CalculatePrice(uniform);
        let finalPrice;
        finalPrice = basePrice;
        const now = new Date();
        console.log("#######################################################");

        console.log(
          "Server item Original Price: (",
          finalPrice,
          ") item Price: (",
          item.price,
          ")"
        );
        console.log("#######################################################");
        console.log("#######################################################");

        console.log(
          "Flashsale: (",
          uniform.flashSale,
          ") FlashSALE start: (",
          uniform.flashSaleStart,
          ") FlashSaleEnd: (",
          uniform.flashSaleEnd,
          ") FlashPrice: (",
          uniform.flashSalePrice,
          ")"
        );
        console.log("#######################################################");

        // Flash Sale
        if (
          uniform.flashSale &&
          uniform.flashSaleStart &&
          uniform.flashSaleEnd &&
          uniform.flashSalePrice
        ) {
          const start = new Date(uniform.flashSaleStart);
          const end = new Date(uniform.flashSaleEnd);
          if (now >= start && now <= end) {
            finalPrice = uniform.flashSalePrice;
            console.log(
              "#######################################################"
            );
            console.log("in now field Final price: ", finalPrice);
            console.log(
              "#######################################################"
            );
          }
        }
        // Discount
        if (uniform.discountPercent && uniform.discountPercent > 0) {
          finalPrice =
            finalPrice - (finalPrice * uniform.discountPercent) / 100;
          console.log(
            "#######################################################"
          );
          console.log(
            "Server discounted item Price: (",
            finalPrice,
            ") item Price: (",
            item.price,
            ")"
          );
          console.log(
            "#######################################################"
          );
        }
        // Defensive check
        if (isNaN(finalPrice)) {
          console.error(
            "in isnan: ",
            `Uniform price not set or invalid for ${uniform.company || uniform.uniformNumberFormat}`
          );
          return new Response(
            JSON.stringify({
              error: `Uniform price not set or invalid for ${uniform.company || uniform.uniformNumberFormat}`,
            }),
            { status: 400 }
          );
        }
        console.log("#######################################################");
        console.log(
          "Server item Price: (",
          finalPrice,
          ") item Price: (",
          item.price,
          ")"
        );
        console.log("#######################################################");

        // Validate the price user is trying to pay
        if (Math.abs(item.price - finalPrice) > 0.01) {
          // Allow small floating point differences
          return new Response(
            JSON.stringify({
              error: `Uniform price mismatch. Expected ${finalPrice.toFixed(2)}, got ${item.price}`,
              expectedPrice: finalPrice,
              receivedPrice: item.price,
              priceType: "regular", // Assuming it's a regular price for now
            }),
            { status: 400 }
          );
        }
        serverTotal += finalPrice * item.qty;
        products[slug] = {
          ...item,
          title: uniform.company,
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
          price: finalPrice,
          originalPrice: basePrice, // Assuming original price is the base price
          flashSalePrice: uniform.flashSalePrice || null,
          discountPercent: uniform.discountPercent || 0,
          priceType: "regular", // Assuming it's a regular price for now
        };
        continue;
      }

      if (product.availability < item.qty) {
        console.log("#######################################################");
        console.log("enter in availity error");
        console.log("#######################################################");
        return new Response(
          JSON.stringify({
            message: `This Product: ${product.title} is out of stock, sorry!`,
            code: "OUT_OF_STOCK",
          }),
          { status: 409 }
        );
      }
      console.log("#######################################################");
      console.log("out availbilty error");
      console.log("#######################################################");

      // âœ… Comprehensive Price Validation for All Product Types
      const now = new Date();
      let finalPrice = product.price; // Start with original price
      let priceType = "regular";

      // Check for Flash Sale
      if (
        product.flashEnd &&
        product.flashPrice &&
        product.flashPrice !== null &&
        product.flashPrice < product.price
      ) {
        console.log("#######################################################");
        console.log("enter in flash sale cheker");
        console.log("#######################################################");
        const flashEndDate = new Date(product.flashEnd);
        console.log("#######################################################");
        console.log("after flashdate calculator", flashEndDate);
        console.log("#######################################################");
        if (now <= flashEndDate) {
          console.log(
            "#######################################################"
          );
          console.log("enter if flash date end valid");
          console.log(
            "#######################################################"
          );
          // Flash sale is active
          finalPrice = product.flashPrice;
          priceType = "flash_sale";
        } else {
          // âœ… Flash sale expired â†’ backend real price accept karega
          finalPrice = product.price;
          priceType = "regular";
        }
      }
      console.log("#######################################################");
      console.log("out flash sale cheker");
      console.log("#######################################################");

      // Apply discount percentage if available (on top of flash price or regular price)
      if (product.discountPercent && product.discountPercent > 0) {
        console.log("#######################################################");
        console.log("enter in discounted cheker");
        console.log("#######################################################");
        finalPrice = finalPrice - (finalPrice * product.discountPercent) / 100;
        priceType =
          priceType === "flash_sale" ? "flash_sale_discounted" : "discounted";
      }

      // Validate the price user is trying to pay
      if (Math.abs(item.price - finalPrice) > 0.01) {
        // Allow small floating point differences
        return new Response(
          JSON.stringify({
            error: `Price mismatch for ${product.title}. Expected: ${finalPrice.toFixed(2)}, got: ${item.price}. Price type: ${priceType}`,
            expectedPrice: finalPrice,
            receivedPrice: item.price,
            priceType: priceType,
          }),
          { status: 400 }
        );
      }

      // Add to server total
      serverTotal += finalPrice * item.qty;
      console.log("#######################################################");
      console.log("after add server total");
      console.log("#######################################################");
      products[slug] = {
        name: product.title,
        size: product.size,
        color: product.color,
        qty: parseInt(item.qty),
        price: finalPrice,
        originalPrice: product.price,
        flashPrice: product.flashPrice || null,
        discountPercent: product.discountPercent || 0,
        priceType: priceType,
      };
    }
    const coupon = await Coupon.findOne({ code: body.code });
    if (body.code && !coupon) {
      return new Response(
        JSON.stringify({
          error: `Invalid coupon code: ${body.code}`,
        }),
        { status: 400 }
      );
    }
    if (coupon) {
      if (coupon.discountType === "percentage") {
        discountAmount = (serverTotal * coupon.discountValue) / 100;
      } else if (coupon.discountType === "flat") {
        discountAmount = coupon.discountValue;
      } else if (coupon.discountType === "bogo") {
        // BOGO logic here
      } else if (coupon.discountType === "free-delivery") {
        // Free delivery logic here
      }
    }
    const expectedAmount = serverTotal + body.deliveryCharge - discountAmount;
    console.log("SERVER TOTAL: ", serverTotal);
    console.log("DISCOUNT AMOUNT: ", discountAmount);
    console.log("EXPECTED amount: ", expectedAmount);

    if (expectedAmount !== body.amount) {
      return new Response(
        JSON.stringify({
          error: `Subtotal mismatch! Expected: ${serverTotal}, received: ${body.amount}.`,
        }),
        { status: 400 }
      );
    }

    if (!/^\d{11}$/.test(body.phone)) {
      console.log("#######################################################");
      console.log("enter in phoone cheker");
      console.log("#######################################################");
      return new Response(
        JSON.stringify({
          message: "Please! Enter a valid 11-digit phone number.",
        }),
        { status: 409 }
      );
    }
    console.log("#######################################################");
    console.log("out phone cheker logic ");
    console.log("#######################################################");
    const odr = new Order({
      name: body.name,
      email: body.email,
      phone: body.phone,
      orderId: body.orderId,
      paymentInfo: `delivery charges is ${body.deliveryCharge}`,
      address: body.address,
      amount: expectedAmount,
      products, // âœ… clean object with slugs as keys
      city: body.city,
      state: body.state,
      status: "pending",
      deliveryStatus: "unshifted",
      deliveryCharge: body.deliveryCharge,
      deliveryMethod: body.deliveryMethod,
      discountValue: discountAmount || "0",
      couponCode: body.code || " ",
    });

    await odr.save();
    console.log("#######################################################");
    console.log("after saving order ");
    console.log("#######################################################");
    return new Response(
      JSON.stringify({
        message: "Order placed successfully, please wait for admin",
        odr,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log("#######################################################");
    console.log("enter in catch block");
    console.log("#######################################################");
    console.error("POST error:", error);
    return new Response(JSON.stringify({ error: "Failed to place order" }), {
      status: 500,
    });
  }
};

import connectDb from "@/middleware/mongoose";

export async function POST(req) {
  try {
    const { couponCode } = await req.json();

    // console.log("coupon code: ", couponCode);

    if (!couponCode || typeof couponCode !== "string") {
      return new Response(JSON.stringify({ message: "Invalid coupon code" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanitize coupon input
    const sanitizedCode = couponCode.trim().toUpperCase();

    const db = await connectDb();

    const coupon = await db.collection("coupons").findOne({
      code: sanitizedCode,
      isActive: true,
    });

    // console.log("coupon: ", coupon);

    if (!coupon) {
      return new Response(
        JSON.stringify({ message: "Coupon not found or expired" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check for expiry date
    const now = new Date();
    if (coupon.expiry && new Date(coupon.expiry) < now) {
      return new Response(
        JSON.stringify({ message: "Coupon has expired" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check for maxUses
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return new Response(
        JSON.stringify({ message: "Coupon usage limit reached" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
// console.log("coupon in validation ",coupon);

    // Return valid coupon info
    return new Response(
      JSON.stringify({
        code: coupon.code,
        type: coupon.discountType,
        value: coupon.discountValue,
        description: coupon.description,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Coupon validation error:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

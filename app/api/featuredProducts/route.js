import connectDb from "@/middleware/mongoose";
import { Product } from "@/models/Product";

export const GET = async (req) => {
  try {
    await connectDb();
    // Pagination
    let page = 1;
    let limit = 24;
    if (req && req.url) {
      const { searchParams } = new URL(req.url, "http://localhost");
      page = parseInt(searchParams.get("page")) || 1;
      limit = parseInt(searchParams.get("limit")) || 24;
    }
    // Get products where featured is true
    const featuredProducts = await Product.find({ featured: true })
      .sort({ createdAt: -1 })
      .lean();

    // Grouping logic: group by title, collect unique available colors and sizes
    let groupedProducts = {};
    for (let item of featuredProducts) {
      const title = item.title;
      if (groupedProducts.hasOwnProperty(title)) {
        if (item.availability > 0) {
          if (!groupedProducts[title].color.includes(item.color)) {
            groupedProducts[title].color.push(item.color);
          }
          if (!groupedProducts[title].size.includes(item.size)) {
            groupedProducts[title].size.push(item.size);
          }
        }
      } else {
        groupedProducts[title] = JSON.parse(JSON.stringify(item));
        groupedProducts[title].color = item.availability > 0 ? [item.color] : [];
        groupedProducts[title].size = item.availability > 0 ? [item.size] : [];
      }
    }
    const grouped = Object.values(groupedProducts);

    // Pagination
    const total = grouped.length;
    const paginated = grouped.slice((page - 1) * limit, page * limit);

    return new Response(
      JSON.stringify({
        featuredProducts: paginated,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Error in GET /api/featuredProducts:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: error.message }),
      { status: 500 }
    );
  }
};

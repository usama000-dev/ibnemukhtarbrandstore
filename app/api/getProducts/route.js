import connectDb from "../../../middleware/mongoose";
import { Product } from "../../../models/Product";

export const GET = async (req) => {
  try {
    await connectDb();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      console.log("ðŸŸ¢ befor fetching one product:::::::::",slug);
      
      // ðŸŸ¢ Return single product if slug is provided
      console.log("ðŸŸ¢ befor fetching one product");
      
      const product = await Product.findOne({ slug }).lean();
      console.log("ðŸŸ¢ after fetching one product: ",product);

      if (!product) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
          status: 404,
        });
      }

      return new Response(JSON.stringify({ product }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ðŸ”µ Otherwise, return all grouped products as before
    const products = await Product.find().lean();

    let groupedProducts = {};
    for (let item of products) {
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

    return new Response(JSON.stringify({ products: grouped }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("âŒ Error in GET /api/getProducts:", error.message);
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: error.message }),
      { status: 500 }
    );
  }
};

import ProductsPageLayout from "@/components/molecules/ProductsPageLayout";
import mongoose from "mongoose";
import LoadingComponent from "../../components/atom/LoadingComponent";
import connectDb from "../../middleware/mongoose";
import { Product } from "../../models/Product";
import CategorySEO from "@/components/atom/CategorySEO";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "All Products - Ibnemukhtar | Winter Jackets & Shoes in Pakistan",
  description:
    "Browse our complete collection of winter jackets and shoes. Quality products for men, women, and kids at affordable prices. Shop now!",
  keywords: [
    "martial arts products",
    "taekwondo equipment",
    "taekwondo belts",
    "taekwondo gloves",
    "taekwondo mugs",
    "sports hoodies",
    "champion-choice store",
    "buy martial arts gear",
    "taekwondo gear in pakistan",
    "taekwondo gear in lahore",
    "taekwondo gear in karachi",
    "taekwondo gear in islamabad",
    "taekwondo gear in faisalabad",
    "taekwondo gear in rawalpindi",
    "taekwondo gear in multan",
    "taekwondo gear in gujranwala"

  ],
};

const Page = async ({ searchParams }) => {
  if (mongoose.connections[0].readyState !== 1) {
    await connectDb();
  }

  // Get category filter from URL - await searchParams
  const params = await searchParams;
  const category = params?.category;
  const tag = params?.tag;

  // Build query
  let query = {};
  if (category) {
    query.category = category;
  }
  if (tag) {
    query.tags = { $in: [tag] };
  }

  const Products = await Product.find(query);
  let tShirts = {};

  for (let item of Products) {
    const title = item.title;

    if (tShirts.hasOwnProperty(title)) {
      if (item.availability > 0) {
        if (!tShirts[title].color.includes(item.color)) {
          tShirts[title].color.push(item.color);
        }
        if (!tShirts[title].size.includes(item.size)) {
          tShirts[title].size.push(item.size);
        }
      }
    } else {
      tShirts[title] = JSON.parse(JSON.stringify(item));
      tShirts[title].color = item.availability > 0 ? [item.color] : [];
      tShirts[title].size = item.availability > 0 ? [item.size] : [];
    }
  }

  const product = JSON.parse(JSON.stringify(tShirts));
  if (!product) {
    return <LoadingComponent />;
  }

  // Prepare category data for SEO
  const categoryData = {
    name: category || "All Products",
    description: category
      ? `Explore ${category} products at Ibnemukhtar Brand Store. High quality winter wear at affordable prices.`
      : "Browse our complete collection of winter jackets and shoes for men, women, and kids. Quality products at best prices.",
    slug: category?.toLowerCase() || "products",
    productCount: Object.keys(product).length,
    parentCategory: "Martial Arts & Taekwondo"
  };

  // Prepare products data for SEO
  const productsForSEO = Object.values(product).slice(0, 10).map(item => ({
    name: item.title,
    price: item.price || 0,
    currency: "PKR",
    image: item.images?.[0] || "/images/championchoice-logo.png",
    url: `https://www.champzones.com/product/${item.slug}`
  }));

  return (
    <>
      <CategorySEO
        category={categoryData}
        products={productsForSEO}
        url="https://www.champzones.com/"
      />
      <ProductsPageLayout product={product} category={category} tag={tag} />
    </>
  );
};

export default Page;

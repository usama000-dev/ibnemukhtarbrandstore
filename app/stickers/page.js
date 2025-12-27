import ProductsPageLayout from "@/components/molecules/ProductsPageLayout";
import mongoose from "mongoose";
import LoadingComponent from "../../components/atom/LoadingComponent";
import connectDb from "../../middleware/mongoose";
import { Product } from "../../models/Product";
import CategorySEO from "@/components/atom/CategorySEO";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Stickers & Logos - CHAMPION-CHOICE | Buy  Karate, Taekwondo & MMA  Stickers and logos in Pakistan",
  description:
    "Explore martial arts-themed stickers and logos at CHAMPION-CHOICE. Perfect for customizing gear, laptops, and accessories with taekwondo, karate, and MMA styles.",
  keywords: [
    "martial arts stickers",
    "karate stickers",
    "taekwondo logos",
    "MMA decals",
    "martial arts logos",
    "gear customization stickers",
    "sports fashion stickers",
    "CHAMPION-CHOICE branding accessories",
    "custom martial arts gear",
  ],
};

const Page = async ({ searchParams }) => {
  if (mongoose.connections[0].readyState !== 1) {
    await connectDb();
  }

  // Get category filter from URL - await searchParams
  const params = await searchParams;
  const category = params?.category || "stikers";
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
    name: "Martial Arts & Taekwondo Stickers & Logos",
    description: "Explore martial arts-themed  stickers and logos at CHAMPION-CHOICE. Perfect for customizing gear, laptops, and accessories with taekwondo, karate, and MMA styles.",
    slug: "stickers",
    productCount: Object.keys(product).length,
    parentCategory: "Accessories"
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

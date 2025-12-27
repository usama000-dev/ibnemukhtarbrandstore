import { Product } from "@/models/Product";
import ProductDetail from "@/components/organism/ProductDetail";
import { connectDb } from "@/middleware/mongodb";
import ProductSEO from "@/components/atom/ProductSEO";

export const dynamic = "force-dynamic";
export const revalidate = 60;

// ✅ Helper to remove HTML tags for meta description
function stripHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, "") // remove HTML tags
    .replace(/\s+/g, " ") // normalize whitespace
    .trim();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  await connectDb();

  const productData = await Product.findOne({ slug }).lean();

  if (productData) {
    const cleanDesc = productData.disc ? stripHtml(productData.disc) : null;

    const title = `${productData.title} | Taekwondo Martial Arts Dobok – Champion Choice`;
    const description =
      cleanDesc && cleanDesc.length > 0
        ? `${cleanDesc} Available now — premium Taekwondo and martial arts gear at Champion Choice`
        : `Premium Taekwondo & martial arts dobok at affordable prices — Champion Choice`;

    const image =
      productData.images?.[0] ||
      "https://www.champzones.com/images/championchoice-logo.png";

    return {
      title,
      description,
      keywords: [
        productData.title,
        "taekwondo",
        "martial arts",
        "dobok",
        "Champion Choice",
      ],
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://www.champzones.com/product/${slug}`,
        siteName: "Champion Choice",
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: productData.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
      alternates: {
        canonical: `https://www.champzones.com/product/${slug}`,
      },
      other: {
        "og:type": "product",
        "og:image:width": "1200",
        "og:image:height": "630",
      },
    };
  }

  return {
    title: "Product Not Found | Champion Choice",
    description: "Sorry, product not found on Champion Choice.",
    openGraph: {
      type: "website",
      images: [
        {
          url: "https://www.champzones.com/images/championchoice-logo.png",
          width: 1200,
          height: 630,
          alt: "Champion Choice Logo",
        },
      ],
    },
    other: {
      "og:type": "website",
    },
  };
}

export default async function SlugPage({ params }) {
  const { slug } = await params;

  if (!slug) return <div>No product found</div>;

  try {
    await connectDb();
    const productData = await Product.findOne({ slug }).lean();

    if (!productData) {
      return <div>Product not found</div>;
    }

    const variants = await Product.find({ title: productData.title }).lean();
    const colorSizeSlug = {};

    for (const item of variants) {
      const { color, size, slug: itemSlug } = item;
      if (!colorSizeSlug[color]) colorSizeSlug[color] = {};
      colorSizeSlug[color][size] = { slug: itemSlug };
    }

    const Products = await Product.find({ category: productData.category });
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

    const productRelatedData = JSON.parse(JSON.stringify(tShirts));

    return (
      <>
        <ProductSEO
          product={{
            name: productData?.title || "Product",
            description:
              stripHtml(productData?.disc) ||
              "Buy the best martial arts products at Champion Choice. High quality, affordable prices.",
            price: productData?.price || 0,
            currency: "PKR",
            availability:
              productData?.availability > 0 ? "InStock" : "OutOfStock",
            brand: "Champion Choice",
            category:
              productData?.category ||
              "Martial Arts & Taekwondo equipments and uniforms and shirts and more...",
            images: productData?.images || [
              "/images/championchoice-logo.png",
            ],
            sku: productData?.slug,
            rating: productData?.rating
              ? {
                value: productData.rating.value || 4.5,
                count: productData.rating.count || 10,
              }
              : undefined,
          }}
          url={`https://www.champzones.com/product/${slug}`}
        />

        <ProductDetail
          params={slug}
          product={JSON.parse(JSON.stringify(productData))}
          variant={JSON.parse(JSON.stringify(colorSizeSlug))}
          productrelatedData={productRelatedData}
        />
      </>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    return <div>Error loading product</div>;
  }
}
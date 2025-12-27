import SEO from "@/components/atom/SEO";

export const metadata = {
  title: "About Us - Ibnemukhtar Brand Store | Quality Winter Wear",
  description: "Learn about Ibnemukhtar Brand Store, Pakistan's trusted source for affordable winter jackets and shoes. Quality products for the whole family.",
  keywords: [
    "about Ibnemukhtar",
    "winter jackets Pakistan",
    "affordable jackets",
    "winter shoes",
    "Pakistani brand",
    "winter wear store",
  ],
};

export default function AboutPage() {
  return (
    <>
      <SEO
        title="About Ibnemukhtar Brand Store"
        description="Learn about Ibnemukhtar Brand Store, Pakistan's trusted source for affordable winter jackets and shoes. Quality products for men, women, and kids with excellent customer service and fast delivery."
        keywords="about Ibnemukhtar, winter jackets Pakistan, affordable jackets, winter shoes, Pakistani brand, winter wear"
        type="website"
        url="https://www.champzones.com/about"
      />
      <div className="container mx-auto px-4 py-8 mt-12 text-center md:text-left">
        <h1 className="text-3xl font-bold mb-6">Ibnemukhtar Brand Store</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            Ibnemukhtar Brand Store is Pakistan's trusted source for quality winter wear at affordable prices.
            We specialize in winter jackets and shoes for men, women, and kids.
          </p>
          <p className="text-lg mb-4">
            Our mission is to provide everyone with access to quality winter clothing without breaking the bank.
            Whether you need a warm jacket for winter or comfortable shoes for daily wear, we have you covered.
          </p>
          <p className="text-lg mb-4">
            We carefully select our products to ensure the best quality at competitive prices.
            Customer satisfaction is our top priority, and we strive to provide excellent service with every order.
          </p>
          <p className="text-lg mb-4">
            We offer a wide range of winter jackets and shoes for all age groups at very affordable prices.
            Fast delivery across Pakistan and easy returns make shopping with us hassle-free.
          </p>
          <p className="text-lg mb-4">
            We are a team of dedicated professionals committed to bringing you the best winter wear collection in Pakistan.
          </p>
        </div>
      </div>
    </>
  );
}

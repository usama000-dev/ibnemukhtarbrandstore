import '../app/globals.css';
import Home from "../components/tamplates/Home";
import SEO from "../components/atom/SEO";

export default function HomePage() {
  return (
    <div>
      <SEO
        title="Ibnemukhtar Brand Store | Winter Jackets & Shoes in Pakistan"
        description="Shop affordable winter jackets and shoes for men, women, and kids. Quality winter wear at best prices in Pakistan. Free delivery on orders above Rs. 3000."
        keywords="winter jackets Pakistan, men jackets, women jackets, kids jackets, winter shoes, affordable jackets, winter collection, branded jackets"
        type="website"
      />
      <Home />
    </div>
  );
}

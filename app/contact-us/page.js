import BorderSection from "@/components/atom/BorderSection";
import SEO from "@/components/atom/SEO";
import Head from "next/head";
import { BsChatText } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa6";
import { MdOutlinePermPhoneMsg } from "react-icons/md";
import { SlSocialTwitter } from "react-icons/sl";
export const metadata = {
  title: "Contact Us - Ibnemukhtar Brand Store | Get in Touch",
  description: "Contact Ibnemukhtar Brand Store for any questions about winter jackets, shoes, or orders. We're here to help with customer support and product inquiries.",
  keywords: [
    "contact Ibnemukhtar",
    "customer support",
    "winter jackets help",
    "product inquiries",
    "order support",
    "customer service",
  ],
};

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Contact Us - Ibnemukhtar Brand Store | Get in Touch"
        description="Contact Ibnemukhtar Brand Store for any questions about winter jackets, shoes, or orders. We are here to help with customer support and product inquiries."
        keywords="contact Ibnemukhtar, customer support, winter jackets help, product inquiries, order support"
        type="website"
        url="https://www.champzones.com/contact-us"
      />
      <div className="max-w-4xl pt-20 mx-auto p-6">
        <Head>
          <title>Contect-Us</title>
          <meta
            name="description"
            content="if any issue then contect you by CHAMPION CHOICE team  "
          />
        </Head>
        <h1 className="text-2xl text-center font-normal mb-1">Contact Us</h1>
        <BorderSection />
        <div className="flex flex-col items-center justify-center mt-10">
          <div className="flex items-center justify-center">
            <FaWhatsapp className="text-5xl text-[#DD8560] hover:text-[#DD8560]/80 mb-4 transition duration-300" />
          </div>
          <p className="text-center mb-4">
            Need an ASAP answer? Contact us via chat, 24/7! For bulk orders of jackets or shoes, please call us.
          </p>
          <a
            href="https://wa.me/+923164288921?body=Hello%20Ibnemukhtar!"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black font-[100] px-4 py-2 text-white hover:bg-gray-800 transition duration-300"
          >
            CHAT WITH US{" "}
          </a>
        </div>
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="flex items-center justify-center">
            <BsChatText className="text-5xl text-[#DD8560] hover:text-[#DD8560]/80 mb-4 transition duration-300" />
          </div>
          <p className="text-center mb-4">
            You can text us at +923164288921 – or click on the “text us” link
            below on your mobile device. Please allow the system to acknowledge a
            simple greeting (even “Hi” will do!) before providing your
            question/order details. Consent is not required for any purchase.
            Message and data rates may apply. Text messaging may not be available
            via all carriers.
          </p>
          <a
            href="sms:+923164288921?body=Hello%20Ibnemukhtar!"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black font-[100] px-4 py-2 text-white hover:bg-gray-800 transition duration-300"
          >
            TEXT WITH US{" "}
          </a>
        </div>
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="flex items-center justify-center">
            <MdOutlinePermPhoneMsg className="text-5xl text-[#DD8560] hover:text-[#DD8560]/80 mb-4 transition duration-300" />
          </div>
          <p className="text-center mb-4">
            You can call us at +923164288921 – or click on the call us” link below
            on your mobile device.Consent is not required for any purchase. Call
            and data rates may apply. Calls may not be available via all carriers.
          </p>
          <a
            href="tel:03164288921"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black font-[100] px-4 py-2 text-white hover:bg-gray-800 transition duration-300"
          >
            CALL WITH US{" "}
          </a>
        </div>
        <div className="flex flex-col items-center justify-center mt-20 mb-8">
          <div className="flex items-center justify-center">
            <SlSocialTwitter className="text-5xl text-[#DD8560] hover:text-[#DD8560]/80 mb-4 transition duration-300" />
          </div>
          <p className="text-center mb-4">
            To send us a private or direct message, like @CHAMPIONCHOICE on{" "}
            <a href="#">Facebook</a> or follow us on <a href="#">Twitter</a>.
            We’ll get back to you ASAP. Please include your name, order number,
            and email address for a faster response!
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            Have questions about our winter jackets, shoes, or need help with your order?
            We are here to help! Contact us through any of the methods below.
          </p>
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
              <div className="space-y-3">
                <p><strong>Email:</strong> ibnemukhtarbrandstore@gmail.com</p>
                <p><strong>Phone:</strong> +92 3164288921</p>
                <p><strong>Address:</strong>Rehmanabad, Chiniot, Punjab, Pakistan</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
              <div className="space-y-2">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 10:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import Head from "next/head";

const ReturnPlicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-12">
      <Head>
        <title>Return Policy - CHAMPION-CHOICE</title>
        <meta
          name="description"
          content="Read our advanced return policy for both Pakistan and international buyers. Learn about eligibility, process, and important terms for returns and exchanges."
        />
      </Head>
      <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-800">Return & Exchange Policy</h1>
      <p className="mb-6 text-lg text-gray-700 text-center">
        At <span className="font-semibold">CHAMPION-CHOICE</span>, we are committed to your satisfaction. Please read our return and exchange policy carefully for both Pakistan and international buyers.
      </p>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">For Buyers in Pakistan</h2>
        <ul className="list-disc pl-6 text-gray-800 mb-4">
          <li>Returns and exchanges are accepted within <span className="font-semibold">7 days</span> of delivery.</li>
          <li>Items must be unused, unwashed, and in original packaging with all tags attached.</li>
          <li>Returns are only accepted for products that are <span className="font-semibold">damaged, defective, or incorrect</span> as delivered.</li>
          <li>Change of mind is <span className="font-semibold text-red-600">not</span> applicable for returns.</li>
          <li>To initiate a return, contact our support team with your order number, photos of the product, and reason for return.</li>
          <li><span className="font-semibold text-blue-700">Return shipping charges will be paid by the customer</span> unless the item was received damaged or incorrect. We always ensure that return shipping costs are reasonable and never exceed the value of the product being returned.</li>
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-2">For International Buyers</h2>
        <ul className="list-disc pl-6 text-gray-800 mb-4">
          <li>Returns and exchanges are accepted within <span className="font-semibold">14 days</span> of delivery.</li>
          <li>Items must be unused, unwashed, and in original packaging with all tags attached.</li>
          <li>Only products that are <span className="font-semibold">damaged, defective, or incorrect</span> as delivered are eligible for return.</li>
          <li>Change of mind is <span className="font-semibold text-red-600">not</span> applicable for returns.</li>
          <li>Contact our support team with your order number, clear photos, and reason for return to initiate the process.</li>
          <li><span className="font-semibold text-blue-700">A fixed return shipping charge of 600 PKR applies for all international returns</span> (unless the item was received damaged or incorrect). We guarantee that the return shipping cost will never exceed the value of the product. If your product value is less than the return shipping, please contact our support for a fair solution.</li>
          <li>International buyers are responsible for any customs duties and taxes on returns unless the item was received damaged or incorrect.</li>
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-blue-600 mb-2">General Terms & Conditions</h2>
        <ul className="list-disc pl-6 text-gray-800 mb-4">
          <li>All returns are subject to inspection. If the product does not meet our return criteria, it will be sent back to the customer.</li>
          <li>Refunds (if applicable) will be processed within 7-10 business days after approval.</li>
          <li>Shipping charges (original and return) are non-refundable unless the return is due to our error.</li>
          <li>Customized or personalized items are <span className="font-semibold text-red-600">not eligible</span> for return or exchange.</li>
        </ul>
      </div>
      <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400">
        <p className="text-blue-900 font-semibold">
          <span className="font-bold">Need Help?</span> Contact our customer support at <a href="mailto:support@championchoice.com" className="underline text-blue-700">support@championchoice.com</a> or WhatsApp for quick assistance.
        </p>
      </div>
    </div>
  );
};

export default ReturnPlicy;

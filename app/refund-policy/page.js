import Head from "next/head";

const RefundPlicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-12">
      <Head>
        <title>Refund Policy - CHAMPION-CHOICE</title>
        <meta
          name="description"
          content="Read our advanced refund policy for both Pakistan and international buyers. Learn about refund eligibility, timelines, and important terms for all purchases."
        />
      </Head>
      <h1 className="text-4xl font-extrabold mb-6 text-center text-green-800">Refund Policy</h1>
      <p className="mb-6 text-lg text-gray-700 text-center">
        At <span className="font-semibold">CHAMPIONs-CHOICE</span>, we value your trust and strive to provide a transparent and fair refund process for all our customers, whether you are shopping from Pakistan or internationally.
      </p>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Refund Policy for Pakistan Purchases</h2>
        <ul className="list-disc pl-6 text-gray-800 mb-4">
          <li>Refunds are only processed for items that are returned and approved as per our <a href="/return-policy" className="underline text-green-700">Return Policy</a>.</li>
          <li>Once your return is received and inspected, you will be notified via email or phone regarding the approval or rejection of your refund.</li>
          <li>If approved, your refund will be processed within <span className="font-semibold">5-7 working days</span> to your original payment method (bank transfer, credit/debit card, or mobile wallet).</li>
          <li>Cash on Delivery (COD) orders will be refunded via bank transfer or mobile wallet. You will be required to provide valid account details.</li>
          <li>Shipping charges (original and return) are non-refundable unless the return is due to our error (damaged, defective, or incorrect item).</li>
          <li>Partial refunds may be granted for items not in their original condition or missing parts for reasons not due to our error.</li>
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-green-700 mb-2">Refund Policy for International Purchases</h2>
        <ul className="list-disc pl-6 text-gray-800 mb-4">
          <li>Refunds for international orders are processed only after the returned item is received, inspected, and approved by our team.</li>
          <li>Refunds will be issued to the original payment method used at checkout (credit/debit card, PayPal, etc.).</li>
          <li>Processing time for international refunds is <span className="font-semibold">7-14 business days</span> after approval, depending on your bank or payment provider.</li>
          <li>Shipping, customs duties, and taxes are non-refundable unless the return is due to our error (damaged, defective, or incorrect item).</li>
          <li>Any currency conversion fees or international transaction charges are the responsibility of the buyer.</li>
        </ul>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold text-green-600 mb-2">Important Terms & Conditions</h2>
        <ul className="list-disc pl-6 text-gray-800 mb-4">
          <li>Refunds are not applicable for customized or personalized products unless they are received damaged or incorrect.</li>
          <li>All refunds are subject to inspection and approval by our quality assurance team.</li>
          <li>If your refund is delayed or missing, please check with your bank or payment provider first, then contact our support team for assistance.</li>
        </ul>
      </div>
      <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-400">
        <p className="text-green-900 font-semibold">
          <span className="font-bold">Questions or Concerns?</span> Contact our customer support at <a href="mailto:championhub00@gamil.com" className="underline text-green-700">championhub00@gmail.com</a> or WhatsApp for prompt help regarding your refund.
        </p>
      </div>
    </div>
  );
};

export default RefundPlicy;

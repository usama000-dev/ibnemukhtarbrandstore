import FAQSEO from "@/components/atom/FAQSEO";

export const metadata = {
  title: "Privacy Policy - Champion Choice | Data Protection & Privacy",
  description: "Read Champion Choice's privacy policy to understand how we collect, use, and protect your personal information when you use our website and services.",
  keywords: [
    "privacy policy",
    "data protection",
    "champion choice privacy",
    "personal information",
    "data collection",
    "privacy rights",
    "cookie policy",
  ],
};

export default function PrivacyPolicyPage() {
  const faqs = [
    {
      question: "What information does Champion Choice collect?",
      answer: "We collect information you provide when you create an account, place orders, or contact us. This includes your name, email address, shipping address, and payment information."
    },
    {
      question: "How does Champion Choice use my information?",
      answer: "We use your information to process orders, provide customer support, send order updates, and improve our services. We never sell your personal information to third parties."
    },
    {
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-standard encryption to protect your payment information. We do not store your complete credit card details on our servers."
    },
    {
      question: "Can I opt out of marketing emails?",
      answer: "Yes, you can unsubscribe from marketing emails at any time by clicking the unsubscribe link in our emails or contacting our customer support team."
    },
    {
      question: "How long does Champion Choice keep my data?",
      answer: "We retain your information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your data at any time."
    },
    {
      question: "What size taekwondo uniform should I buy?",
      answer: "You can select your size based on your height and weight. Please refer to our size chart on the product page."
    },
    {
      question: "Are Champion Choice uniforms competition approved?",
      answer: "Yes, our uniforms meet the standards required for most national and international taekwondo competitions."
    },
    {
      question: "Can I customize my martial arts gear?",
      answer: "Yes, we offer custom embroidery and logo printing on select items. Contact support for details."
    },
    {
      question: "Do you deliver taekwondo gear in Pakistan?",
      answer: "Yes, we deliver nationwide including Lahore, Karachi, Islamabad, Faisalabad, and other cities."
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 3-5 business days across Pakistan. You’ll receive tracking details after dispatch."
    },
        
  ];

  return (
    <>
      <FAQSEO 
        title="Privacy Policy"
        description="Read Champion Choice's privacy policy to understand how we collect, use, and protect your personal information when you use our website and services."
        faqs={faqs}
        url="https://www.champzones.com/privacy-policy"
        category="Legal"
      />
      <div className="container mx-auto px-4 py-8 mt-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            At Champion Choice, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This privacy policy explains how we collect, use, and protect your data when you use our website and services.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide when you create an account, place orders, or contact us. 
            This includes your name, email address, shipping address, and payment information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
          <p className="mb-4">
            We use your information to process orders, provide customer support, send order updates, 
            and improve our services. We never sell your personal information to third parties.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
          <p className="mb-4">
            We implement appropriate security measures to protect your personal information against unauthorized access, 
            alteration, disclosure, or destruction.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
          <p className="mb-4">
            You have the right to access, correct, or delete your personal information. 
            You can also opt out of marketing communications at any time.
          </p>
        </div>
      </div>
    </>
  );
}
// Test SMTP configuration
const testSMTP = async () => {
  try {
    console.log('🧪 Testing SMTP configuration...');
    
    const response = await fetch('http://localhost:3000/api/email/flash-sale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: "🎉 Welcome to CodeCkraker!",
        description: "Thank you for setting up your email system. This is a test email to verify everything is working perfectly.",
        discount: "Test Email",
        endTime: "2024-12-31T23:59:59Z",
        products: [
          {
            name: "Test Product",
            originalPrice: 100,
            salePrice: 50,
            image: "https://via.placeholder.com/150"
          }
        ]
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ SMTP Test Successful!');
      console.log('📧 Email sent to all subscribers');
      console.log('📊 Campaign created:', result.campaignId);
    } else {
      console.log('❌ SMTP Test Failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
};

// Run test
testSMTP(); 
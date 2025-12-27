// Test script to verify email system
const testEmail = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/email/flash-sale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: "Test Flash Sale",
        description: "This is a test flash sale email",
        discount: "50% OFF",
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
    console.log('Test result:', result);
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run test if this file is executed
if (typeof window === 'undefined') {
  testEmail();
} 
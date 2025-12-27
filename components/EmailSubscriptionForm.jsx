'use client';

import { useState } from 'react';

const EmailSubscriptionForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Successfully subscribed! Check your email for confirmation.');
        setEmail('');
      } else {
        setMessage(`❌ ${data.message || 'Subscription failed'}`);
      }
    } catch (error) {
      setMessage('❌ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white">
      <h3 className="text-xl font-bold mb-4">Stay Updated!</h3>
      <p className="mb-4">Get exclusive deals, flash sales, and product updates delivered to your inbox.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="flex-1 px-4 py-2 rounded text-gray-800"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100 disabled:opacity-50"
        >
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      
      {message && (
        <p className="mt-3 text-sm">{message}</p>
      )}
    </div>
  );
};

export default EmailSubscriptionForm; 
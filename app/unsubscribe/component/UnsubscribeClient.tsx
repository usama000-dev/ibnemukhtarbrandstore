'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { cancelPendingRequests } from '@/services/api';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [subscriber, setSubscriber] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [unsubscribed, setUnsubscribed] = useState(false);

  useEffect(() => {
    if (token || email) {
      fetchSubscriber();
    } else {
      setLoading(false);
    }
    return () => {
      cancelPendingRequests();
    };
  }, [token, email]);

  const fetchSubscriber = async () => {
    try {
      const params = new URLSearchParams();
      if (token) params.append('token', token);
      if (email) params.append('email', email);

      const response = await fetch(`/api/email/unsubscribe?${params}`);
      const data = await response.json();

      if (data.success) {
        setSubscriber(data.subscriber);
      } else {
        setMessage('Invalid unsubscribe link');
      }
    } catch (error) {
      setMessage('Error loading subscriber information');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      const response = await fetch('/api/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email })
      });

      const data = await response.json();

      if (data.success) {
        setUnsubscribed(true);
        setMessage('Successfully unsubscribed from all email notifications');
      } else {
        setMessage('Failed to unsubscribe');
      }
    } catch (error) {
      setMessage('Error unsubscribing');
    }
  };

  const handleResubscribe = async () => {
    try {
      const response = await fetch('/api/email/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: subscriber.email,
          preferences: {
            deals: true,
            flashSales: true,
            newsletters: true,
            productUpdates: true
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setUnsubscribed(false);
        setMessage('Successfully resubscribed to email notifications');
        fetchSubscriber();
      } else {
        setMessage('Failed to resubscribe');
      }
    } catch (error) {
      setMessage('Error resubscribing');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!token && !email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unsubscribe</h1>
          <p className="text-gray-600 mb-6">
            Invalid unsubscribe link. Please check your email for the correct link.
          </p>
          <a
            href="/"
            className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {unsubscribed ? 'Unsubscribed' : 'Unsubscribe'}
        </h1>

        {subscriber && (
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              <strong>Email:</strong> {subscriber.email}
            </p>
            {subscriber.name && (
              <p className="text-gray-600 mb-2">
                <strong>Name:</strong> {subscriber.name}
              </p>
            )}
            <p className="text-gray-600 mb-4">
              <strong>Status:</strong>{' '}
              <span className={subscriber.isActive ? 'text-green-600' : 'text-red-600'}>
                {subscriber.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>

            {!unsubscribed && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Email Preferences:</h3>
                <div className="space-y-2">
                  {Object.entries(subscriber.preferences).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <span className={`w-3 h-3 rounded-full mr-2 ${
                        value ? 'bg-green-500' : 'bg-gray-300'
                      }`}></span>
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {message && (
          <div className={`p-3 rounded mb-4 ${
            message.includes('Successfully') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-3">
          {!unsubscribed ? (
            <button
              onClick={handleUnsubscribe}
              className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
            >
              Unsubscribe from All Emails
            </button>
          ) : (
            <button
              onClick={handleResubscribe}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Resubscribe to Emails
            </button>
          )}

          <a
            href="/"
            className="block w-full text-center bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
          >
            Go Home
          </a>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            If you have any questions about our email policy, please contact us.
          </p>
        </div>
      </div>
    </div>
  );
}

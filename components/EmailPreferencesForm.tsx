'use client';

import { cancelPendingRequests } from '@/services/api';
import { useState, useEffect } from 'react';

interface EmailPreferencesFormProps {
  email: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

interface Preferences {
  deals: boolean;
  flashSales: boolean;
  newsletters: boolean;
  productUpdates: boolean;
}

export default function EmailPreferencesForm({
  email,
  onSuccess,
  onError,
  className = ""
}: EmailPreferencesFormProps) {
  const [preferences, setPreferences] = useState<Preferences>({
    deals: true,
    flashSales: true,
    newsletters: true,
    productUpdates: true
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [subscriber, setSubscriber] = useState<any>(null);

  useEffect(() => {
    if (email) {
      fetchPreferences();
    }
    return () => {
      cancelPendingRequests();
    };
  }, [email]);

  const fetchPreferences = async () => {
    try {
      const response = await fetch(`/api/email/preferences?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (data.success) {
        setSubscriber(data.subscriber);
        setPreferences(data.subscriber.preferences);
      } else {
        setMessage('Subscriber not found');
        onError?.('Subscriber not found');
      }
    } catch (error) {
      setMessage('Error loading preferences');
      onError?.('Error loading preferences');
    }
  };

  const handlePreferenceChange = (key: keyof Preferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/email/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          preferences
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Preferences updated successfully!');
        onSuccess?.();
      } else {
        setMessage(data.error || 'Failed to update preferences');
        onError?.(data.error || 'Failed to update preferences');
      }
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
      onError?.('Network error');
    } finally {
      setLoading(false);
    }
  };

  if (!subscriber) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Email Preferences</h3>
        <p className="text-gray-600">Manage your email subscription preferences</p>
        <p className="text-sm text-gray-500 mt-1">{email}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Deals & Offers</h4>
              <p className="text-sm text-gray-600">Receive emails about special deals and discounts</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.deals}
                onChange={() => handlePreferenceChange('deals')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Flash Sales</h4>
              <p className="text-sm text-gray-600">Get notified about limited-time flash sales</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.flashSales}
                onChange={() => handlePreferenceChange('flashSales')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Newsletters</h4>
              <p className="text-sm text-gray-600">Receive our weekly newsletter with updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.newsletters}
                onChange={() => handlePreferenceChange('newsletters')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <h4 className="font-semibold text-gray-900">Product Updates</h4>
              <p className="text-sm text-gray-600">Get notified about new products and updates</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.productUpdates}
                onChange={() => handlePreferenceChange('productUpdates')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded ${
            message.includes('successfully') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Preferences'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setPreferences({
                deals: false,
                flashSales: false,
                newsletters: false,
                productUpdates: false
              });
            }}
            className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
          >
            Unsubscribe All
          </button>
        </div>
      </form>

      <div className="mt-6 pt-4 border-t">
        <p className="text-xs text-gray-500">
          You can unsubscribe from all emails at any time. Your preferences will be saved automatically.
        </p>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function UnsubscribeContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [subscriberEmail, setSubscriberEmail] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Invalid unsubscribe link');
            setLoading(false);
            return;
        }

        handleUnsubscribe();
    }, [token]);

    const handleUnsubscribe = async () => {
        try {
            const response = await fetch('/api/email/unsubscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                setSubscriberEmail(data.email || '');
            } else {
                setError(data.error || 'Failed to unsubscribe');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            {loading ? (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold text-gray-800">Processing...</h2>
                    <p className="text-gray-600 mt-2">Please wait while we unsubscribe you</p>
                </div>
            ) : success ? (
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Successfully Unsubscribed</h2>
                    <p className="text-gray-600 mb-4">
                        {subscriberEmail && (
                            <>
                                <span className="font-medium">{subscriberEmail}</span> has been removed from our mailing list.
                            </>
                        )}
                        {!subscriberEmail && "You have been removed from our mailing list."}
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        You will no longer receive marketing emails from us. We&apos;re sorry to see you go!
                    </p>
                    <div className="space-y-3">
                        <a
                            href="/"
                            className="block w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
                        >
                            Return to Homepage
                        </a>
                        <button
                            onClick={() => window.location.reload()}
                            className="block w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
                        >
                            Changed your mind? Resubscribe
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Unsubscribe Failed</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <a
                            href="/"
                            className="block w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
                        >
                            Return to Homepage
                        </a>
                        <a
                            href="/contact"
                            className="block w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
                        >
                            Contact Support
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function UnsubscribePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <Suspense fallback={
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold text-gray-800">Loading...</h2>
                </div>
            }>
                <UnsubscribeContent />
            </Suspense>
        </div>
    );
}

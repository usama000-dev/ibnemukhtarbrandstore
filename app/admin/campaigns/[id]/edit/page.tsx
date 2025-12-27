'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface Campaign {
    _id: string;
    name: string;
    type: string;
    subject: string;
    htmlContent: string;
    textContent: string;
    status: string;
    scheduledAt?: string;
}

export default function EditCampaignPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // Form state
    const [name, setName] = useState('');
    const [subject, setSubject] = useState('');
    const [htmlContent, setHtmlContent] = useState('');
    const [scheduledAt, setScheduledAt] = useState('');

    useEffect(() => {
        fetchCampaign();
    }, [params.id]);

    const fetchCampaign = async () => {
        try {
            const res = await fetch(`/api/email/campaigns/${params.id}`);
            const data = await res.json();

            if (data.success) {
                setCampaign(data.campaign);
                setName(data.campaign.name);
                setSubject(data.campaign.subject);
                setHtmlContent(data.campaign.htmlContent);
                setScheduledAt(data.campaign.scheduledAt ? new Date(data.campaign.scheduledAt).toISOString().slice(0, 16) : '');
            } else {
                setMessage('Failed to load campaign');
            }
        } catch (error) {
            console.error('Error fetching campaign:', error);
            setMessage('Error loading campaign');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');

        try {
            const res = await fetch(`/api/email/campaigns/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    subject,
                    htmlContent,
                    textContent: htmlContent.replace(/<[^>]*>/g, ''), // Strip HTML for text version
                    scheduledAt: scheduledAt || null,
                }),
            });

            const data = await res.json();

            if (data.success) {
                setMessage('✅ Campaign saved successfully!');
                setTimeout(() => router.push('/admin/email-campaigns'), 1500);
            } else {
                setMessage('❌ Failed to save: ' + data.error);
            }
        } catch (error) {
            console.error('Error saving campaign:', error);
            setMessage('❌ Error saving campaign');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this campaign?')) return;

        try {
            const res = await fetch(`/api/email/campaigns/${params.id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.success) {
                router.push('/admin/email-campaigns');
            } else {
                setMessage('❌ Failed to delete: ' + data.error);
            }
        } catch (error) {
            console.error('Error deleting campaign:', error);
            setMessage('❌ Error deleting campaign');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading campaign...</div>
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-xl text-red-600">Campaign not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Edit Campaign</h1>
                        <p className="text-gray-500 mt-1">
                            Status: <span className="font-semibold capitalize">{campaign.status}</span>
                        </p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    >
                        ← Back
                    </button>
                </div>

                {/* Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {message}
                    </div>
                )}

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                    {/* Campaign Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Campaign Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g. Summer Sale 2024"
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Subject
                        </label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Subject line..."
                        />
                    </div>

                    {/* Schedule */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Schedule (Optional)
                        </label>
                        <input
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={(e) => setScheduledAt(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to save as draft</p>
                    </div>

                    {/* Content Editor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Content
                        </label>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <ReactQuill
                                theme="snow"
                                value={htmlContent}
                                onChange={setHtmlContent}
                                className="bg-white"
                                style={{ minHeight: '400px' }}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                        <button
                            onClick={handleDelete}
                            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                            disabled={campaign.status === 'sending'}
                        >
                            Delete Campaign
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={() => router.back()}
                                className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';
import { useState, useEffect } from 'react';
import { DealCheckService, DealProduct } from '@/services/dealCheckService';
import { cancelPendingRequests } from '@/services/api';

interface Campaign {
    _id: string;
    name: string;
    type: string;
    status: string;
    createdAt: string;
    scheduledAt?: string;
    sentAt?: string;
    subject?: string;
    htmlContent?: string;
    analytics: {
        emailsSent: number;
        emailsDelivered: number;
        openRate?: number;
        clickRate?: number;
    };
}

export default function EmailCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);

    // Deal detection
    const [activeDeals, setActiveDeals] = useState<{
        flashSales: DealProduct[];
        discounts: DealProduct[];
        hasActiveDeals: boolean;
        totalActiveDeals: number;
    }>({
        flashSales: [],
        discounts: [],
        hasActiveDeals: false,
        totalActiveDeals: 0
    });
    const [sendingFlashSale, setSendingFlashSale] = useState(false);
    const [sendingDeal, setSendingDeal] = useState(false);

    // Campaign form data
    const [campaignData, setCampaignData] = useState({
        name: '',
        type: 'flash-sale',
        subject: '',
        htmlContent: '',
        textContent: '',
        scheduledAt: '',
        targetAllSubscribers: true,
        targetPreferences: [] as string[]
    });

    useEffect(() => {
        fetchCampaigns();
        checkActiveDeals();

        const interval = setInterval(() => {
            fetchCampaigns();
        }, 10000);

        return () => {
            cancelPendingRequests();
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredCampaigns(campaigns);
        } else {
            setFilteredCampaigns(campaigns.filter(c => c.status === statusFilter));
        }
    }, [statusFilter, campaigns]);

    const fetchCampaigns = async () => {
        try {
            const response = await fetch('/api/email/campaigns');
            const data = await response.json();
            if (data.success) {
                setCampaigns(data.campaigns || []);
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    const checkActiveDeals = async () => {
        try {
            const deals = await DealCheckService.checkActiveDeals();
            setActiveDeals(deals);
        } catch (error) {
            console.error('Error checking active deals:', error);
        }
    };

    const createCampaign = async () => {
        if (!campaignData.name || !campaignData.subject || !campaignData.htmlContent) {
            setMessage('❌ Please fill in all required fields!');
            return;
        }

        setCreating(true);
        setMessage('');

        try {
            const response = await fetch('/api/email/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: campaignData.name,
                    type: campaignData.type,
                    subject: campaignData.subject,
                    htmlContent: campaignData.htmlContent,
                    textContent: campaignData.textContent || campaignData.htmlContent.replace(/<[^>]*>/g, ''),
                    scheduledAt: campaignData.scheduledAt || null,
                    targetAudience: {
                        allSubscribers: campaignData.targetAllSubscribers,
                        specificPreferences: campaignData.targetPreferences
                    }
                }),
            });

            const result = await response.json();

            if (result.success) {
                setMessage('✅ Campaign created successfully!');
                setShowCreateModal(false);
                setCampaignData({
                    name: '',
                    type: 'flash-sale',
                    subject: '',
                    htmlContent: '',
                    textContent: '',
                    scheduledAt: '',
                    targetAllSubscribers: true,
                    targetPreferences: []
                });
                fetchCampaigns();
            } else {
                setMessage(`❌ Failed: ${result.error}`);
            }
        } catch (error) {
            setMessage('❌ Error creating campaign');
        } finally {
            setCreating(false);
        }
    };

    const sendFlashSaleEmail = async () => {
        if (!activeDeals.flashSales.length) {
            setMessage('❌ No active flash sales found!');
            return;
        }
        setSendingFlashSale(true);
        setMessage('');
        try {
            const flashSale = activeDeals.flashSales[0];
            const products = activeDeals.flashSales.slice(0, 6).map(product => ({
                name: product.title,
                originalPrice: product.originalPrice || product.price,
                salePrice: product.salePrice || product.flashPrice || product.flashSalePrice || product.price,
                image: product.image || product.imageUrl || 'https://via.placeholder.com/150'
            }));
            const response = await fetch('/api/email/flash-sale', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `🔥 Flash Sale Alert - ${Math.round(flashSale.discountPercent || 0)}% OFF!`,
                    description: `Limited time flash sale with amazing discounts on ${activeDeals.flashSales.length} products!`,
                    discount: `${Math.round(flashSale.discountPercent || 0)}% OFF`,
                    endTime: flashSale.flashEnd || flashSale.flashSaleEnd || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    products
                }),
            });
            const result = await response.json();
            if (result.success) {
                setMessage(`✅ Flash sale email sent! ${result.result.emailsSent} emails sent.`);
                fetchCampaigns();
            } else {
                setMessage(`❌ Failed: ${result.error}`);
            }
        } catch (error) {
            setMessage('❌ Error sending flash sale email');
        } finally {
            setSendingFlashSale(false);
        }
    };

    const sendDealEmail = async () => {
        if (!activeDeals.discounts.length) {
            setMessage('❌ No active deals found!');
            return;
        }
        setSendingDeal(true);
        setMessage('');
        try {
            const deal = activeDeals.discounts[0];
            const products = activeDeals.discounts.slice(0, 6).map(product => ({
                name: product.title,
                originalPrice: product.originalPrice || product.price,
                salePrice: product.salePrice || product.price,
                image: product.image || product.imageUrl || 'https://via.placeholder.com/150'
            }));
            const response = await fetch('/api/email/deal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: `🎉 Special Deal Alert - ${Math.round(deal.discountPercent || 0)}% OFF!`,
                    description: `Amazing deals with up to ${Math.round(deal.discountPercent || 0)}% off on ${activeDeals.discounts.length} products!`,
                    discount: `${Math.round(deal.discountPercent || 0)}% OFF`,
                    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    products
                }),
            });
            const result = await response.json();
            if (result.success) {
                setMessage(`✅ Deal email sent! ${result.result.emailsSent} emails sent.`);
                fetchCampaigns();
            } else {
                setMessage(`❌ Failed: ${result.error}`);
            }
        } catch (error) {
            setMessage('❌ Error sending deal email');
        } finally {
            setSendingDeal(false);
        }
    };

    if (loading) {
        return <div className="p-12 text-center text-gray-500">Loading campaigns...</div>;
    }

    return (
        <div className="w-full p-6">

            {/* DEAL DETECTION BANNER */}
            {activeDeals.hasActiveDeals && (
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-6 mb-6 rounded-xl shadow-2xl border-4 border-red-600 animate-pulse">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center animate-bounce">
                                <span className="text-4xl">🔥</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-black mb-1">ACTIVE DEALS DETECTED!</h3>
                                <p className="text-red-100 font-medium">
                                    {activeDeals.flashSales.length > 0 && `${activeDeals.flashSales.length} Flash Sales`}
                                    {activeDeals.flashSales.length > 0 && activeDeals.discounts.length > 0 && ' + '}
                                    {activeDeals.discounts.length > 0 && `${activeDeals.discounts.length} Discounts`}
                                    {' '}found! Send campaigns now.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {activeDeals.flashSales.length > 0 && (
                                <button
                                    onClick={sendFlashSaleEmail}
                                    disabled={sendingFlashSale}
                                    className="px-6 py-3 bg-white text-red-600 font-black rounded-lg hover:bg-red-50 shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
                                >
                                    {sendingFlashSale ? '⏳ Sending...' : `🚀 Send Flash Sale (${activeDeals.flashSales.length})`}
                                </button>
                            )}
                            {activeDeals.discounts.length > 0 && (
                                <button
                                    onClick={sendDealEmail}
                                    disabled={sendingDeal}
                                    className="px-6 py-3 bg-white text-orange-600 font-black rounded-lg hover:bg-orange-50 shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
                                >
                                    {sendingDeal ? '⏳ Sending...' : `💰 Send Deals (${activeDeals.discounts.length})`}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Message Banner */}
            {message && (
                <div className={`mb-6 p-4 rounded-lg font-medium ${message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message}
                </div>
            )}

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Email Campaigns</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all flex items-center gap-2"
                >
                    <span className="text-xl">+</span>
                    Create Campaign
                </button>
            </div>

            {/* STATUS FILTERS */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex gap-2 flex-wrap">
                    {['all', 'draft', 'scheduled', 'sent', 'failed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${statusFilter === status
                                ? status === 'all' ? 'bg-blue-600 text-white shadow-md' :
                                    status === 'draft' ? 'bg-gray-600 text-white shadow-md' :
                                        status === 'scheduled' ? 'bg-yellow-600 text-white shadow-md' :
                                            status === 'sent' ? 'bg-green-600 text-white shadow-md' :
                                                'bg-red-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)} ({status === 'all' ? campaigns.length : campaigns.filter(c => c.status === status).length})
                        </button>
                    ))}
                </div>
            </div>

            {/* CAMPAIGNS LIST */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        {statusFilter === 'all' ? 'All Campaigns' : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Campaigns`}
                    </h2>
                    <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-500 border border-gray-200">
                        {filteredCampaigns.length} {statusFilter === 'all' ? 'Total' : statusFilter}
                    </span>
                </div>

                {filteredCampaigns.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 bg-gray-50">
                        <p className="text-lg font-bold">No {statusFilter === 'all' ? '' : statusFilter} campaigns found.</p>
                        <p className="text-sm mt-2">
                            {statusFilter === 'all' ? 'Click "Create Campaign" to get started!' : `No campaigns with status "${statusFilter}".`}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredCampaigns.map((campaign) => (
                            <div key={campaign._id} className="p-6 hover:bg-blue-50/30 transition-colors">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-lg text-gray-900">{campaign.name}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${campaign.type === 'flash-sale' ? 'bg-red-100 text-red-700' :
                                                campaign.type === 'deal' ? 'bg-green-100 text-green-700' :
                                                    'bg-blue-100 text-blue-700'
                                                }`}>
                                                {campaign.type}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide border ${campaign.status === 'sent' ? 'bg-green-50 text-green-700 border-green-200' :
                                                campaign.status === 'sending' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    campaign.status === 'draft' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                                                        campaign.status === 'failed' ? 'bg-red-50 text-red-700 border-red-200' :
                                                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {campaign.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 flex items-center gap-2">
                                            <span>Created: {new Date(campaign.createdAt).toLocaleDateString()}</span>
                                            {campaign.scheduledAt && (
                                                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                    Scheduled: {new Date(campaign.scheduledAt).toLocaleString()}
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-gray-900">{campaign.analytics?.emailsSent || 0}</div>
                                            <div className="text-gray-500 text-xs uppercase">Sent</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-green-600">{campaign.analytics?.openRate || 0}%</div>
                                            <div className="text-gray-500 text-xs uppercase">Open Rate</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-blue-600">{campaign.analytics?.clickRate || 0}%</div>
                                            <div className="text-gray-500 text-xs uppercase">Click Rate</div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                                            <>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm(`Send "${campaign.name}" now?`)) {
                                                            try {
                                                                const res = await fetch(`/api/email/campaigns/${campaign._id}/send`, { method: 'POST' });
                                                                const result = await res.json();
                                                                if (result.success) {
                                                                    setMessage('✅ Campaign queued for sending!');
                                                                    fetchCampaigns();
                                                                } else {
                                                                    setMessage('❌ Failed: ' + result.error);
                                                                }
                                                            } catch (e) {
                                                                setMessage('❌ Error sending campaign');
                                                            }
                                                        }
                                                    }}
                                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm transition-all"
                                                >
                                                    📤 Send Now
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingCampaign(campaign);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-all"
                                                >
                                                    ✏️ Edit
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={async () => {
                                                if (confirm(`Delete "${campaign.name}"? This cannot be undone.`)) {
                                                    try {
                                                        const res = await fetch(`/api/email/campaigns/${campaign._id}`, { method: 'DELETE' });
                                                        const result = await res.json();
                                                        if (result.success) {
                                                            setMessage('✅ Campaign deleted!');
                                                            fetchCampaigns();
                                                        } else {
                                                            setMessage('❌ Failed to delete');
                                                        }
                                                    } catch (e) {
                                                        setMessage('❌ Error deleting campaign');
                                                    }
                                                }
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-all"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* CREATE CAMPAIGN MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl flex justify-between items-center">
                            <h3 className="text-2xl font-bold">✨ Create New Campaign</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-white hover:text-gray-200 text-3xl font-bold">×</button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Name *</label>
                                    <input type="text" value={campaignData.name} onChange={e => setCampaignData({ ...campaignData, name: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="e.g. Winter Flash Sale 2024" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Type *</label>
                                    <select value={campaignData.type} onChange={e => setCampaignData({ ...campaignData, type: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all">
                                        <option value="flash-sale">🔥 Flash Sale</option>
                                        <option value="deal">💰 Deal / Discount</option>
                                        <option value="newsletter">📰 Newsletter</option>
                                        <option value="product-update">🆕 Product Update</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Subject Line *</label>
                                <input type="text" value={campaignData.subject} onChange={e => setCampaignData({ ...campaignData, subject: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" placeholder="e.g. 🔥 Huge Savings - Up to 50% OFF Today Only!" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email HTML Content *</label>
                                <textarea value={campaignData.htmlContent} onChange={e => setCampaignData({ ...campaignData, htmlContent: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-mono text-sm" rows={8} placeholder="<div>Your email HTML content here...</div>" />
                                <p className="text-xs text-gray-500 mt-1">HTML content for the email body</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Plain Text Content (Optional)</label>
                                <textarea value={campaignData.textContent} onChange={e => setCampaignData({ ...campaignData, textContent: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" rows={4} placeholder="Plain text version (auto-generated if left empty)" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Schedule Date/Time (Optional)</label>
                                <input type="datetime-local" value={campaignData.scheduledAt} onChange={e => setCampaignData({ ...campaignData, scheduledAt: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all" />
                                <p className="text-xs text-gray-500 mt-1">Leave empty to save as draft. Set a future date to schedule.</p>
                            </div>

                            <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                                <h4 className="font-bold text-gray-900 mb-3">Target Audience</h4>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                    <input type="checkbox" checked={campaignData.targetAllSubscribers} onChange={e => setCampaignData({ ...campaignData, targetAllSubscribers: e.target.checked })} className="w-4 h-4" />
                                    Send to all active subscribers
                                </label>

                                {!campaignData.targetAllSubscribers && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600 mb-2">Select specific preferences:</p>
                                        {['flashSales', 'deals', 'newsletters', 'productUpdates'].map(pref => (
                                            <label key={pref} className="flex items-center gap-2 text-sm text-gray-700">
                                                <input type="checkbox" checked={campaignData.targetPreferences.includes(pref)} onChange={e => { if (e.target.checked) { setCampaignData({ ...campaignData, targetPreferences: [...campaignData.targetPreferences, pref] }); } else { setCampaignData({ ...campaignData, targetPreferences: campaignData.targetPreferences.filter(p => p !== pref) }); } }} className="w-4 h-4" />
                                                {pref === 'flashSales' ? 'Flash Sales' : pref === 'productUpdates' ? 'Product Updates' : pref.charAt(0).toUpperCase() + pref.slice(1)}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center rounded-b-2xl">
                            <button onClick={() => setShowPreview(true)} disabled={!campaignData.htmlContent} className="px-6 py-3 text-indigo-700 bg-indigo-50 border-2 border-indigo-200 font-bold rounded-lg hover:bg-indigo-100 transition-all disabled:opacity-50">👁️ Preview Email</button>
                            <div className="flex gap-3">
                                <button onClick={() => setShowCreateModal(false)} className="px-6 py-3 text-gray-700 font-bold hover:bg-gray-200 rounded-lg transition-all">Cancel</button>
                                <button onClick={createCampaign} disabled={creating} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none">{creating ? '⏳ Creating...' : '✅ Create Campaign'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT CAMPAIGN MODAL */}
            {showEditModal && editingCampaign && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl flex justify-between items-center">
                            <h3 className="text-2xl font-bold">✏️ Edit Campaign</h3>
                            <button onClick={() => { setShowEditModal(false); setEditingCampaign(null); }} className="text-white hover:text-gray-200 text-3xl font-bold">×</button>
                        </div>

                        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Campaign Name *</label>
                                <input type="text" value={editingCampaign.name} onChange={e => setEditingCampaign({ ...editingCampaign, name: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" disabled={editingCampaign.status === 'sent'} />
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                                <p className="text-sm text-gray-700"><span className="font-bold">Current Status:</span> <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${editingCampaign.status === 'sent' ? 'bg-green-100 text-green-700' : editingCampaign.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'}`}>{editingCampaign.status}</span></p>
                                {editingCampaign.status === 'sent' && <p className="text-sm text-red-600 mt-2">⚠️ Sent campaigns cannot be edited. You can only view details.</p>}
                            </div>

                            {editingCampaign.status !== 'sent' && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Schedule Date/Time (Optional)</label>
                                    <input type="datetime-local" value={editingCampaign.scheduledAt ? new Date(editingCampaign.scheduledAt).toISOString().slice(0, 16) : ''} onChange={e => setEditingCampaign({ ...editingCampaign, scheduledAt: e.target.value })} className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all" />
                                    <p className="text-xs text-gray-500 mt-1">Leave empty to keep as draft. Set a future date to schedule.</p>
                                </div>
                            )}

                            {editingCampaign.status === 'sent' && (
                                <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-4">Campaign Analytics</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="text-center"><div className="text-2xl font-bold text-gray-900">{editingCampaign.analytics?.emailsSent || 0}</div><div className="text-gray-500 text-sm">Emails Sent</div></div>
                                        <div className="text-center"><div className="text-2xl font-bold text-green-600">{editingCampaign.analytics?.openRate || 0}%</div><div className="text-gray-500 text-sm">Open Rate</div></div>
                                        <div className="text-center"><div className="text-2xl font-bold text-blue-600">{editingCampaign.analytics?.clickRate || 0}%</div><div className="text-gray-500 text-sm">Click Rate</div></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
                            <button onClick={() => { setShowEditModal(false); setEditingCampaign(null); }} className="px-6 py-3 text-gray-700 font-bold hover:bg-gray-200 rounded-lg transition-all">{editingCampaign.status === 'sent' ? 'Close' : 'Cancel'}</button>
                            {editingCampaign.status !== 'sent' && (
                                <button onClick={async () => { setUpdating(true); try { const response = await fetch(`/api/email/campaigns/${editingCampaign._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: editingCampaign.name, scheduledAt: editingCampaign.scheduledAt || null, }), }); const result = await response.json(); if (result.success) { setMessage('✅ Campaign updated successfully!'); setShowEditModal(false); setEditingCampaign(null); fetchCampaigns(); } else { setMessage(`❌ Failed: ${result.error}`); } } catch (error) { setMessage('❌ Error updating campaign'); } finally { setUpdating(false); } }} disabled={updating} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none">{updating ? '⏳ Updating...' : '✅ Save Changes'}</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* EMAIL PREVIEW MODAL */}
            {showPreview && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white flex justify-between items-center">
                            <h3 className="text-2xl font-bold">👁️ Email Preview</h3>
                            <button onClick={() => setShowPreview(false)} className="text-white hover:text-gray-200 text-3xl font-bold">×</button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                            <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                                <p className="text-sm text-gray-700"><span className="font-bold">Subject:</span> {campaignData.subject || '(No subject)'}</p>
                            </div>

                            <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                                <iframe srcDoc={campaignData.htmlContent || '<p>No content to preview</p>'} className="w-full h-[500px] border-0" title="Email Preview" sandbox="allow-same-origin" />
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
                            <button onClick={() => setShowPreview(false)} className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all">Close Preview</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

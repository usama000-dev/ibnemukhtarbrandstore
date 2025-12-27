'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dashboard as DashboardIcon, Campaign, People, Sync, TrendingUp } from '@mui/icons-material';
import DashboardStats from '@/components/admin/DashboardStats';
import EmailCampaignsPage from '@/components/admin/EmailCampaignsPage';
import EmailSubscribersPage from '@/components/admin/EmailSubscribersPage';

export default function EmailDashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        totalSubscribers: 0,
        activeSubscribers: 0,
        totalCampaigns: 0,
        totalEmailsSent: 0
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const subRes = await fetch('/api/email/subscribers');
            const subData = await subRes.json();

            const campRes = await fetch('/api/email/campaigns');
            const campData = await campRes.json();

            if (subData.success) {
                setStats(prev => ({
                    ...prev,
                    totalSubscribers: subData.stats?.total || 0,
                    activeSubscribers: subData.stats?.active || 0,
                    totalEmailsSent: subData.stats?.totalEmailsSent || 0
                }));
            }

            if (campData.success) {
                setStats(prev => ({
                    ...prev,
                    totalCampaigns: campData.pagination?.total || 0
                }));
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSyncData = async () => {
        try {
            setMessage('⏳ Syncing data...');
            const response = await fetch('/api/email/sync', { method: 'POST' });
            const result = await response.json();
            if (result.success) {
                setMessage(`✅ Sync Complete: ${result.results.users.added} users, ${result.results.orders.added} orders added.`);
                fetchStats();
            } else {
                setMessage('❌ Sync failed: ' + result.error);
            }
            setTimeout(() => setMessage(''), 5000);
        } catch (error) {
            setMessage('❌ Error syncing data');
            setTimeout(() => setMessage(''), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 lg:ml-[270px] mt-16 md:mt-20">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                            📧 Email & Marketing Dashboard
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm md:text-base">Manage campaigns, subscribers, and analytics in one place</p>
                    </div>
                    <button
                        onClick={handleSyncData}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-blue-200 rounded-xl hover:bg-blue-50 hover:border-blue-400 text-gray-700 shadow-sm transition-all font-medium"
                    >
                        <Sync className={`text-blue-600 ${message.includes('Syncing') ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Sync Data</span>
                    </button>
                </motion.div>

                {/* Message Banner */}
                <AnimatePresence>
                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`mb-6 p-4 rounded-xl shadow-md border-2 font-medium ${message.includes('✅') ? 'bg-green-50 border-green-300 text-green-800' :
                                    message.includes('❌') ? 'bg-red-50 border-red-300 text-red-800' :
                                        'bg-blue-50 border-blue-300 text-blue-800'
                                }`}
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* TABS */}
                <div className="flex mb-6 border-b-2 border-gray-200 bg-white rounded-t-2xl px-2 md:px-4 pt-3 shadow-lg overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 font-bold text-sm md:text-base transition-all rounded-t-xl whitespace-nowrap ${activeTab === 'overview'
                                ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <DashboardIcon fontSize="small" />
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('campaigns')}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 font-bold text-sm md:text-base transition-all rounded-t-xl whitespace-nowrap ${activeTab === 'campaigns'
                                ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Campaign fontSize="small" />
                        Campaigns
                    </button>
                    <button
                        onClick={() => setActiveTab('subscribers')}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 font-bold text-sm md:text-base transition-all rounded-t-xl whitespace-nowrap ${activeTab === 'subscribers'
                                ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <People fontSize="small" />
                        Subscribers
                    </button>
                </div>

                {/* Content Area */}
                <div className="min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                {/* Stats */}
                                <DashboardStats stats={stats} />

                                {/* Quick Actions */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all cursor-pointer"
                                        onClick={() => setActiveTab('campaigns')}
                                    >
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                            <Campaign fontSize="large" className="text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Create New Campaign</h3>
                                        <p className="text-gray-600 mb-4 text-sm">Launch email campaigns for Flash Sales, Deals, or Custom Newsletters.</p>
                                        <div className="flex items-center text-blue-600 font-bold text-sm">
                                            Go to Campaigns →
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all cursor-pointer"
                                        onClick={() => setActiveTab('subscribers')}
                                    >
                                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                                            <People fontSize="large" className="text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Subscribers</h3>
                                        <p className="text-gray-600 mb-4 text-sm">View audience, add subscribers, sync data, and export lists.</p>
                                        <div className="flex items-center text-purple-600 font-bold text-sm">
                                            View Subscribers →
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'campaigns' && (
                            <motion.div
                                key="campaigns"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                                    <EmailCampaignsPage />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'subscribers' && (
                            <motion.div
                                key="subscribers"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
                                    <EmailSubscribersPage />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

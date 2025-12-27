'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { People, Email, Campaign, TrendingUp } from '@mui/icons-material';

interface StatsData {
    totalSubscribers: number;
    activeSubscribers?: number;
    totalCampaigns: number;
    totalEmailsSent: number;
}

interface DashboardStatsProps {
    stats: StatsData;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
    const statCards = [
        {
            title: 'Total Subscribers',
            value: stats.totalSubscribers || 0,
            icon: <People fontSize="large" className="text-blue-600" />,
            color: 'border-blue-500',
            bgColor: 'bg-blue-100',
            trend: '+12% this month'
        },
        {
            title: 'Emails Sent',
            value: stats.totalEmailsSent || 0,
            icon: <Email fontSize="large" className="text-purple-600" />,
            color: 'border-purple-500',
            bgColor: 'bg-purple-100',
            trend: '+2.4%'
        },
        {
            title: 'Open Rate',
            value: '0%',
            icon: <TrendingUp fontSize="large" className="text-green-600" />,
            color: 'border-green-500',
            bgColor: 'bg-green-100',
        },
        {
            title: 'Active Campaigns',
            value: stats.totalCampaigns || 0,
            icon: <Campaign fontSize="large" className="text-orange-600" />,
            color: 'border-orange-500',
            bgColor: 'bg-orange-100',
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => (
                <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`bg-white p-6 rounded-2xl shadow-sm border-l-4 ${stat.color} flex items-center justify-between hover:shadow-md transition-shadow`}
                >
                    <div>
                        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.title}</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                        {stat.trend && <p className="text-sm text-green-500 mt-2 font-medium">{stat.trend}</p>}
                    </div>
                    <div className={`p-4 rounded-full ${stat.bgColor}`}>
                        {stat.icon}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default DashboardStats;

'use client';
import { useState, useEffect } from 'react';
import { cancelPendingRequests } from '@/services/api';
import EmailManageSubscribersTable from './EmailManageSubscribersTable';
import BaseCard from '@/app/admin/(DashboardLayout)/components/shared/BaseCard';

interface Subscriber {
  _id: string;
  email: string;
  phone?: string;
  name: string;
  source: string;
  isActive: boolean;
  subscribedAt: string;
  totalEmailsSent: number;
  notes: string;
  tags: string[];
  interests: string[];
  totalClicks: number;
  lastClickAt?: string;
}

interface SubscriberStats {
  total: number;
  active: number;
  inactive: number;
  sources: { [key: string]: number };
}

export default function EmailSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<SubscriberStats>({ total: 0, active: 0, inactive: 0, sources: {} });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(20);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState<Subscriber | null>(null);
  const [newSubscriber, setNewSubscriber] = useState({
    email: '', phone: '', name: '', source: 'manual' as 'registration' | 'order' | 'manual', notes: '', tags: '', interests: ''
  });
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
    return () => { cancelPendingRequests(); };
  }, [currentPage, statusFilter, sourceFilter]);

  const fetchSubscribers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(), limit: pageSize.toString(),
        status: statusFilter, source: sourceFilter, search: searchTerm
      });
      const response = await fetch(`/api/email/subscribers?${params}`);
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.subscribers);
        setTotalPages(data.pagination.pages);
      }
    } catch (error) { console.error('Error fetching subscribers:', error); } finally { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      // Try specific stats endpoint preferably
      const response = await fetch('/api/email/subscribers/stats');
      const data = await response.json();
      if (data.success) { setStats(data.stats); return; }

      // Fallback
      const fbRepsonse = await fetch('/api/email/subscribers');
      const fbData = await fbRepsonse.json();
      if (fbData.success && fbData.stats) {
        setStats({ total: fbData.stats.total || 0, active: fbData.stats.active || 0, inactive: fbData.stats.inactive || 0, sources: {} });
      }
    } catch (error) { console.error('Error fetching stats:', error); }
  };

  const handleSearch = () => { setCurrentPage(1); fetchSubscribers(); };
  const handleStatusChange = (status: string) => { setStatusFilter(status); setCurrentPage(1); };
  const handleSourceChange = (source: string) => { setSourceFilter(source); setCurrentPage(1); };

  const handleAddSubscriber = async () => {
    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newSubscriber, tags: newSubscriber.tags.split(',').filter(Boolean), interests: newSubscriber.interests.split(',').filter(Boolean) }),
      });
      const result = await response.json();
      if (result.success) {
        setShowAddModal(false);
        setNewSubscriber({ email: '', phone: '', name: '', source: 'manual', notes: '', tags: '', interests: '' });
        fetchSubscribers(); fetchStats();
      } else { alert(`Failed: ${result.error}`); }
    } catch (error) { alert('Error adding subscriber'); }
  };

  const handleUpdateNotes = async () => {
    if (!selectedSubscriber) return;
    try {
      const response = await fetch('/api/email/subscribers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: selectedSubscriber.email, notes: notesText }),
      });
      const result = await response.json();
      if (result.success) { setShowNotesModal(false); setSelectedSubscriber(null); setNotesText(''); fetchSubscribers(); }
      else { alert(`Failed: ${result.error}`); }
    } catch (error) { alert('Error updating notes'); }
  };

  const handleToggleStatus = async (email: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/email/subscribers', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, isActive: !isActive }), });
      if ((await response.json()).success) { fetchSubscribers(); fetchStats(); }
    } catch (error) { alert('Error updating status'); }
  };

  const handleSyncData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/email/sync', { method: 'POST' });
      const result = await response.json();
      if (result.success) { alert(`Sync Complete! Users: ${result.results.users.added}, Orders: ${result.results.orders.added}`); fetchSubscribers(); fetchStats(); }
      else { alert('Sync failed: ' + result.error); }
    } catch (error) { alert('Error syncing data'); } finally { setLoading(false); }
  };

  const handleDeleteSubscriber = async (email: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      if ((await (await fetch('/api/email/subscribers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })).json()).success) { fetchSubscribers(); fetchStats(); }
    } catch (e) { alert('Error deleting'); }
  };

  const handleExportCSV = () => {
    const params = new URLSearchParams({ status: statusFilter, source: sourceFilter });
    window.open(`/api/email/subscribers/export?${params}`, '_blank');
  };

  const openNotesModal = (subscriber: Subscriber) => { setSelectedSubscriber(subscriber); setNotesText(subscriber.notes || ''); setShowNotesModal(true); };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading subscribers...</div>;

  return (
    <div className="w-full">
      <BaseCard>
        <EmailManageSubscribersTable
          stats={stats}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSearch={handleSearch}
          statusFilter={statusFilter}
          handleStatusChange={handleStatusChange}
          sourceFilter={sourceFilter}
          handleSourceChange={handleSourceChange}
          setShowAddModal={setShowAddModal}
          handleExportCSV={handleExportCSV}
          subscribers={subscribers}
          openNotesModal={openNotesModal}
          handleToggleStatus={handleToggleStatus}
          handleDeleteSubscriber={handleDeleteSubscriber}
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          showAddModal={showAddModal}
          newSubscriber={newSubscriber}
          setNewSubscriber={setNewSubscriber}
          handleAddSubscriber={handleAddSubscriber}
          showNotesModal={showNotesModal}
          selectedSubscriber={selectedSubscriber}
          notesText={notesText}
          setNotesText={setNotesText}
          handleUpdateNotes={handleUpdateNotes}
          setShowNotesModal={setShowNotesModal}
          handleSyncData={handleSyncData}
        />
      </BaseCard>
    </div>
  );
}

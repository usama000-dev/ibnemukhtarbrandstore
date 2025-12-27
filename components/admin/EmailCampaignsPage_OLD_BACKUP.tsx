'use client';
import { useState, useEffect } from 'react';
import { DealCheckService, DealProduct } from '@/services/dealCheckService';

import { Box, Container, Grid, styled } from '@mui/material';
import Head from 'next/head';
import theme from "@/utils/theme";
import Sidebar from '@/app/admin/(DashboardLayout)/layout/sidebar/Sidebar';
import Header from '@/app/admin/(DashboardLayout)/layout/header/Header';


const MainWrapper = styled("div")(() => ({
  display: "flex",
  // minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "25px",
  flexDirection: "column",
  backgroundColor: "transparent",
}));

interface Campaign {
  _id: string;
  name: string;
  type: string;
  status: string;
  createdAt: string;
  analytics: {
    emailsSent: number;
    emailsDelivered: number;
  };
}

interface CustomEmailData {
  subject: string;
  title: string;
  description: string;
  discount: string;
  endTime: string;
  products: Array<{
    name: string;
    originalPrice: number;
    salePrice: number;
    image: string;
  }>;
}

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Email sending states
  const [sendingFlashSale, setSendingFlashSale] = useState(false);
  const [sendingDeal, setSendingDeal] = useState(false);
  const [sendingCustom, setSendingCustom] = useState(false);
  const [message, setMessage] = useState('');

  // Custom email editor states
  const [showCustomEditor, setShowCustomEditor] = useState(false);
  const [customEmailData, setCustomEmailData] = useState<CustomEmailData>({
    subject: '',
    title: '',
    description: '',
    discount: '',
    endTime: '',
    products: []
  });

  // Test email states
  const [showTestEmail, setShowTestEmail] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');

  useEffect(() => {
    fetchCampaigns();
    checkActiveDeals();
  }, []);

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
        headers: {
          'Content-Type': 'application/json',
        },
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
        setMessage(`✅ Flash sale email sent successfully! ${result.result.emailsSent} emails sent.`);
        fetchCampaigns();
      } else {
        setMessage(`❌ Failed to send flash sale email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending flash sale email:', error);
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
        headers: {
          'Content-Type': 'application/json',
        },
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
        setMessage(`✅ Deal email sent successfully! ${result.result.emailsSent} emails sent.`);
        fetchCampaigns();
      } else {
        setMessage(`❌ Failed to send deal email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending deal email:', error);
      setMessage('❌ Error sending deal email');
    } finally {
      setSendingDeal(false);
    }
  };

  const sendCustomEmail = async () => {
    if (!customEmailData.subject || !customEmailData.title || !customEmailData.products.length) {
      setMessage('❌ Please fill all required fields!');
      return;
    }

    setSendingCustom(true);
    setMessage('');

    try {
      const response = await fetch('/api/email/flash-sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customEmailData),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`✅ Custom email sent successfully! ${result.result.emailsSent} emails sent.`);
        setShowCustomEditor(false);
        fetchCampaigns();
      } else {
        setMessage(`❌ Failed to send custom email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending custom email:', error);
      setMessage('❌ Error sending custom email');
    } finally {
      setSendingCustom(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmailAddress) {
      setMessage('❌ Please enter test email address!');
      return;
    }

    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmailAddress,
          type: 'flash-sale',
          data: {
            title: 'Test Flash Sale',
            description: 'This is a test email',
            discount: '50% OFF',
            endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            products: [
              {
                name: 'Test Product',
                originalPrice: 100,
                salePrice: 50,
                image: 'https://via.placeholder.com/150'
              }
            ]
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage('✅ Test email sent successfully!');
        setShowTestEmail(false);
      } else {
        setMessage(`❌ Failed to send test email: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      setMessage('❌ Error sending test email');
    }
  };

  const addProductToCustom = () => {
    setCustomEmailData(prev => ({
      ...prev,
      products: [...prev.products, {
        name: '',
        originalPrice: 0,
        salePrice: 0,
        image: ''
      }]
    }));
  };

  const updateCustomProduct = (index: number, field: string, value: any) => {
    setCustomEmailData(prev => ({
      ...prev,
      products: prev.products.map((product, i) =>
        i === index ? { ...product, [field]: value } : product
      )
    }));
  };

  const removeCustomProduct = (index: number) => {
    setCustomEmailData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="p-6">Loading campaigns...</div>;
  }

  return (
    <MainWrapper className="mainwrapper">
      <Head>
        <title> Email Dashboard - CHAMPION-CHOICE</title>
        <meta
          name="description"
          content="This page was design for only admin in which can you can see all users who signup in website for all analyzing best of luck "
        />
      </Head>
      <style jsx global>{`
 .footer,
 .header {
   display: none;
 }
`}</style>
      <PageWrapper className="page-wrapper">
        <Sidebar />
        <Box
          sx={{
            [theme.breakpoints.up("lg")]: {
              marginLeft: "270px",
            },
          }}
        >
          <Header />
          <Container
            sx={{
              paddingTop: "20px",
              maxWidth: "1200px",
              minHeight: "calc(100vh - 240px)",
            }}
          >
            <Grid container spacing={0}>
              <Grid
                size={{
                  xs: 12,
                  lg: 12,
                }}
              >
                <div className="p-6">
                  <h1 className="text-2xl font-bold mb-6">Email Campaigns Dashboard</h1>

                  {/* Active Deals Status */}
                  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Active Deals Status</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800">Flash Sales</h3>
                        <p className="text-2xl font-bold text-blue-600">{activeDeals.flashSales.length}</p>
                        <p className="text-sm text-blue-600">Active flash sales</p>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-green-800">Discounts</h3>
                        <p className="text-2xl font-bold text-green-600">{activeDeals.discounts.length}</p>
                        <p className="text-sm text-green-600">Active discounts</p>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-purple-800">Total Deals</h3>
                        <p className="text-2xl font-bold text-purple-600">{activeDeals.totalActiveDeals}</p>
                        <p className="text-sm text-purple-600">Active deals</p>
                      </div>
                    </div>

                    {/* Email Send Buttons - Separate for each type */}
                    <div className="space-y-4">
                      {/* Flash Sale Button */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={sendFlashSaleEmail}
                          disabled={sendingFlashSale || !activeDeals.flashSales.length}
                          className={`px-6 py-3 rounded-lg font-semibold text-white ${sendingFlashSale || !activeDeals.flashSales.length
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700'
                            }`}
                        >
                          {sendingFlashSale ? 'Sending...' : `Send Flash Sale Email (${activeDeals.flashSales.length} items)`}
                        </button>
                        {!activeDeals.flashSales.length && (
                          <span className="text-sm text-gray-500">No active flash sales</span>
                        )}
                      </div>

                      {/* Discount Button */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={sendDealEmail}
                          disabled={sendingDeal || !activeDeals.discounts.length}
                          className={`px-6 py-3 rounded-lg font-semibold text-white ${sendingDeal || !activeDeals.discounts.length
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                          {sendingDeal ? 'Sending...' : `Send Discount Email (${activeDeals.discounts.length} items)`}
                        </button>
                        {!activeDeals.discounts.length && (
                          <span className="text-sm text-gray-500">No active discounts</span>
                        )}
                      </div>

                      {/* Custom Email Button */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setShowCustomEditor(true)}
                          className="px-6 py-3 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700"
                        >
                          Create Custom Email
                        </button>
                      </div>

                      {/* Test Email Button */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setShowTestEmail(true)}
                          className="px-6 py-3 rounded-lg font-semibold text-white bg-orange-600 hover:bg-orange-700"
                        >
                          Send Test Email
                        </button>
                      </div>
                    </div>

                    {!activeDeals.hasActiveDeals && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                        <p className="text-yellow-800 font-semibold">⚠️ No Active Deals</p>
                        <p className="text-yellow-700 text-sm">
                          Email send options will appear when you have active flash sales or discounts.
                        </p>
                      </div>
                    )}

                    {message && (
                      <div className={`mt-4 p-3 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {message}
                      </div>
                    )}
                  </div>

                  {/* Custom Email Editor Modal */}
                  {showCustomEditor && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4">Create Custom Email</h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <input
                              type="text"
                              value={customEmailData.subject}
                              onChange={(e) => setCustomEmailData(prev => ({ ...prev, subject: e.target.value }))}
                              className="w-full p-2 border rounded"
                              placeholder="Enter email subject"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <input
                              type="text"
                              value={customEmailData.title}
                              onChange={(e) => setCustomEmailData(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full p-2 border rounded"
                              placeholder="Enter email title"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                              value={customEmailData.description}
                              onChange={(e) => setCustomEmailData(prev => ({ ...prev, description: e.target.value }))}
                              className="w-full p-2 border rounded"
                              rows={3}
                              placeholder="Enter email description"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Discount</label>
                              <input
                                type="text"
                                value={customEmailData.discount}
                                onChange={(e) => setCustomEmailData(prev => ({ ...prev, discount: e.target.value }))}
                                className="w-full p-2 border rounded"
                                placeholder="e.g., 50% OFF"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">End Time</label>
                              <input
                                type="datetime-local"
                                value={customEmailData.endTime}
                                onChange={(e) => setCustomEmailData(prev => ({ ...prev, endTime: e.target.value }))}
                                className="w-full p-2 border rounded"
                              />
                            </div>
                          </div>

                          {/* Products Section */}
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-sm font-medium">Products</label>
                              <button
                                onClick={addProductToCustom}
                                className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                              >
                                Add Product
                              </button>
                            </div>

                            {customEmailData.products.map((product, index) => (
                              <div key={index} className="border p-4 rounded mb-2">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-medium">Product {index + 1}</span>
                                  <button
                                    onClick={() => removeCustomProduct(index)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    Remove
                                  </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => updateCustomProduct(index, 'name', e.target.value)}
                                    className="p-2 border rounded"
                                    placeholder="Product name"
                                  />
                                  <input
                                    type="number"
                                    value={product.originalPrice}
                                    onChange={(e) => updateCustomProduct(index, 'originalPrice', parseFloat(e.target.value) || 0)}
                                    className="p-2 border rounded"
                                    placeholder="Original price"
                                  />
                                  <input
                                    type="number"
                                    value={product.salePrice}
                                    onChange={(e) => updateCustomProduct(index, 'salePrice', parseFloat(e.target.value) || 0)}
                                    className="p-2 border rounded"
                                    placeholder="Sale price"
                                  />
                                  <input
                                    type="text"
                                    value={product.image}
                                    onChange={(e) => updateCustomProduct(index, 'image', e.target.value)}
                                    className="p-2 border rounded"
                                    placeholder="Image URL"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={sendCustomEmail}
                            disabled={sendingCustom}
                            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                          >
                            {sendingCustom ? 'Sending...' : 'Send Custom Email'}
                          </button>
                          <button
                            onClick={() => setShowCustomEditor(false)}
                            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Test Email Modal */}
                  {showTestEmail && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-xl font-semibold mb-4">Send Test Email</h3>

                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">Test Email Address</label>
                          <input
                            type="email"
                            value={testEmailAddress}
                            onChange={(e) => setTestEmailAddress(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter email address"
                          />
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={sendTestEmail}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            Send Test Email
                          </button>
                          <button
                            onClick={() => setShowTestEmail(false)}
                            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Campaigns List */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>

                    {campaigns.length === 0 ? (
                      <p className="text-gray-500">No campaigns found.</p>
                    ) : (
                      <div className="space-y-4">
                        {campaigns.map((campaign) => (
                          <div key={campaign._id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold">{campaign.name}</h3>
                                <p className="text-sm text-gray-600">
                                  Type: {campaign.type} | Status: {campaign.status}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Created: {new Date(campaign.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">
                                  Sent: {campaign.analytics?.emailsSent || 0}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Delivered: {campaign.analytics?.emailsDelivered || 0}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Grid>
            </Grid>{" "}
          </Container>
        </Box>
      </PageWrapper>
    </MainWrapper>

  );
}


import DashboardCard from '@/app/admin/(DashboardLayout)/components/shared/DashboardCard';
import { cancelPendingRequests } from '@/services/api';
import { Avatar, Fab, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconArrowDownRight, IconCurrencyDollar } from '@tabler/icons-react';
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Order {
  _id: string;
  updatedAt: string;
  amount: number;
  status: string;
  [key: string]: any; // For any additional properties
}

interface EarningsData {
  total: number;
  changePercentage: number;
  weeklyData: number[];
}


const MonthlyEarnings = () => {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#f5fcff';
  const errorlight = '#fdede8';
  const [earningsData, setEarningsData] = useState({
    total: 0,
    changePercentage: 0,
    weeklyData: [0, 0, 0, 0, 0, 0, 0] as number[]
  });
  const [loading, setLoading] = useState(true);

  // Enhanced fetch function with debugging
  const fetchDeliveredOrders = useCallback(async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token") || "";
      console.log("Making API request...");

      const res = await fetch("/api/get-orders?deliveryStatus=deliverd", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("monthly API response status:", res.status);

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API error response:", errorData);
        throw new Error(errorData.message || "Failed to fetch orders");
      }

      const data = await res.json();
      console.log("monthly API response data:", data);

      if (!data.orders || !Array.isArray(data.orders)) {
        console.error("Invalid orders data:", data);
        throw new Error("Invalid orders data received");
      }

      processOrderData(data.orders);
    } catch (error: unknown) {
      console.error("Full error details:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []); // 
  // Enhanced processing with debugging
  const processOrderData = (orders: Order[]) => {
    // console.log('Processing orders:', orders);
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Filter and log delivered orders
    const recentOrders = orders.filter(order => {
      if (!order.updatedAt) {
        console.warn('Order missing delivered:', order._id);
        return false;
      }
      const deliveredDate = new Date(order.updatedAt);
      return deliveredDate >= oneWeekAgo;
    });
    
    // console.log('Recent delivered orders:', recentOrders);

    const dailyEarnings = Array(7).fill(0);
    
    recentOrders.forEach(order => {
      try {
        const deliveryDate = new Date(order.updatedAt);
        const daysDiff = now.getTime() - deliveryDate.getTime();
        const dayIndex = Math.floor(daysDiff / (24 * 60 * 60 * 1000));
        
        if (dayIndex >= 0 && dayIndex < 7) {
          dailyEarnings[6 - dayIndex] += order.amount || 0;
        }
      } catch (dateError) {
        console.error('Error processing order date:', order._id, dateError);
      }
    });

    const totalEarnings = recentOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
    
    // console.log('Calculated daily earnings:', dailyEarnings);
    // console.log('Total earnings:', totalEarnings);

    // Simplified percentage change - replace with your actual calculation
    const changePercentage = 9; // Temporary value

    setEarningsData({
      total: totalEarnings,
      changePercentage,
      weeklyData: dailyEarnings
    });
  };

  const optionscolumnchart = {
    chart: {
      type: 'area' as const,
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 60,
      sparkline: { enabled: true },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth' as const,
      width: 2,
    },
    fill: {
      colors: [secondarylight],
      type: 'solid' as const,
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (value: number) => `Rs${value.toFixed(2)}/_`
      }
    },
    xaxis: {
      categories: ['6d ago', '5d ago', '4d ago', '3d ago', '2d ago', 'Yesterday', 'Today'],
      labels: { show: false }
    },
    yaxis: { show: false }
  };

  const seriescolumnchart = [
    {
      name: 'Earnings',
      color: secondary,
      data: earningsData.weeklyData
    }
  ];

  useEffect(() => {
    fetchDeliveredOrders();
    
    const interval = setInterval(fetchDeliveredOrders, 5 * 60 * 1000);
    return () => {
      clearInterval(interval);
      cancelPendingRequests();
    };
  }, [fetchDeliveredOrders]); // ✅ Stable & safe

  return (
    <DashboardCard
      title="Monthly Earnings"
      action={
        <Fab color="secondary" size="medium" sx={{color: '#ffffff'}}>
          <IconCurrencyDollar width={24} />
        </Fab>
      }
      footer={
        loading ? (
          <Typography variant="body2" sx={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Loading data...
          </Typography>
        ) : (
          <Chart 
            options={optionscolumnchart} 
            series={seriescolumnchart} 
            type="area" 
            height="60px" 
          />
        )
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          Rs.{loading ? '...' : earningsData.total.toFixed(2)}/_
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          <Avatar sx={{ bgcolor: errorlight, width: 27, height: 27 }}>
            <IconArrowDownRight width={20} color="#FA896B" />
          </Avatar>
          <Typography variant="subtitle2" fontWeight="600">
            {loading ? '...' : `${earningsData.changePercentage}%`}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            last week
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
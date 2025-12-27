import DashboardCard from "@/app/admin/(DashboardLayout)/components/shared/DashboardCard";
import { cancelPendingRequests } from "@/services/api";
import { Avatar, Grid, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconArrowUpLeft } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Order {
  _id: string;
  amount: number;
  status: string;
  updatedAt: string; // Delivery date
}

const YearlyBreakup = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = "#ecf2ff";
  const successlight = theme.palette.success.light;

  const [loading, setLoading] = useState(true);
  const [yearlyData, setYearlyData] = useState({
    currentYearTotal: 0,
    lastYearTotal: 0,
    percentageChange: 0,
    yearlyBreakdown: [0, 0], // [current year, last year]
  });

  // Fetch delivered orders data
  const fetchDeliveredOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || "";

      const response = await fetch("/api/get-orders?deliveryStatus=deliverd", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      if (!data.orders || !Array.isArray(data.orders)) {
        throw new Error("Invalid orders data format");
      }

      processOrderData(data.orders);
    } catch (error: unknown) {
      console.error("Fetch error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  }, []);
  // Process orders to get yearly breakdown
  const processOrderData = (orders: Order[]) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const lastYear = currentYear - 1;

    let currentYearTotal = 0;
    let lastYearTotal = 0;

    orders.forEach((order) => {
      if (!order.updatedAt) return;

      const deliveryDate = new Date(order.updatedAt);
      const deliveryYear = deliveryDate.getFullYear();
      const amount = order.amount || 0;

      if (deliveryYear === currentYear) {
        currentYearTotal += amount;
      } else if (deliveryYear === lastYear) {
        lastYearTotal += amount;
      }
    });

    // Calculate percentage change
    const percentageChange =
      lastYearTotal > 0
        ? Math.round(((currentYearTotal - lastYearTotal) / lastYearTotal) * 100)
        : currentYearTotal > 0
        ? 100
        : 0;

    setYearlyData({
      currentYearTotal,
      lastYearTotal,
      percentageChange,
      yearlyBreakdown: [currentYearTotal, lastYearTotal],
    });
  };

  // Chart options
  const optionscolumnchart: any = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: { show: false },
      height: 155,
    },
    colors: [primary, primarylight, "#F9F9FD"],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
      y: {
        formatter: (value: number) => `Rs.${value.toLocaleString()}/_`,
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };

  // Initial fetch
  useEffect(() => {
    fetchDeliveredOrders();
    return () => {
      cancelPendingRequests();
    };
  }, [fetchDeliveredOrders]);

  return (
    <DashboardCard title="Yearly Breakup">
      <Grid container spacing={3}>
        {/* Left column - Stats */}
        <Grid
          size={{
            xs: 12,
            lg: 12,
          }}
        >
          {loading ? (
            <Typography variant="h6">Loading...</Typography>
          ) : (
            <>
              <Typography variant="h3" fontWeight="700">
                Rs.{yearlyData.currentYearTotal.toLocaleString()}/_
              </Typography>
              <Stack direction="row" spacing={1} mt={1} alignItems="center">
                <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
                  <IconArrowUpLeft width={20} color="#39B69A" />
                </Avatar>
                <Typography variant="subtitle2" fontWeight="600">
                  {yearlyData.percentageChange >= 0 ? "+" : ""}
                  {yearlyData.percentageChange}%
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  last year
                </Typography>
              </Stack>
              <Stack spacing={3} mt={5} direction="row">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{
                      width: 9,
                      height: 9,
                      bgcolor: primary,
                      svg: { display: "none" },
                    }}
                  ></Avatar>
                  <Typography variant="subtitle2" color="textSecondary">
                    {new Date().getFullYear() - 1}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    sx={{
                      width: 9,
                      height: 9,
                      bgcolor: primarylight,
                      svg: { display: "none" },
                    }}
                  ></Avatar>
                  <Typography variant="subtitle2" color="textSecondary">
                    {new Date().getFullYear()}
                  </Typography>
                </Stack>
              </Stack>
            </>
          )}
        </Grid>

        {/* Right column - Chart */}
        <Grid
          size={{
            xs: 12,
            lg: 12,
          }}
        >
          {loading ? (
            <Typography
              variant="body2"
              sx={{ height: "150px", display: "flex", alignItems: "center" }}
            >
              Loading chart...
            </Typography>
          ) : (
            <Chart
              options={optionscolumnchart}
              series={yearlyData.yearlyBreakdown}
              type="donut"
              height="150px"
            />
          )}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;

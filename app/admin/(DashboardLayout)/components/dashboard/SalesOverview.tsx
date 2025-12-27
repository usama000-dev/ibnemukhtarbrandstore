import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import BaseCard from "../shared/DashboardCard";
import { cancelPendingRequests } from "@/services/api";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const SalesOverview = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const [series, setSeries] = useState<{ name: string; data: number[] }[]>([]);

  const fetchOrderData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token"); // 👈 ya jahan store ho
      const res = await axios.post("/api/get-orders?deliveryStatus=deliverd", {
        token,
      });

      const orders = res.data.orders || [];

      const monthlyRevenue = Array(12).fill(0); // Revenue per month
      const monthlyOrders = Array(12).fill(0); // Number of orders per month

      orders.forEach(
        (order: { createdAt: string | number | Date; amount: number }) => {
          const date = new Date(order.createdAt);
          const month = date.getMonth(); // 0 = Jan, 11 = Dec

          monthlyRevenue[month] += order.amount;
          monthlyOrders[month] += 1;
        }
      );

      setSeries([
        {
          name: "Revenue",
          data: monthlyRevenue,
        },
        {
          name: "Orders",
          data: monthlyOrders,
        },
      ]);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  }, []);

  useEffect(() => {
    fetchOrderData();
    return () => {
      cancelPendingRequests();
    };
  }, [fetchOrderData]);

  const options: any = {
    chart: {
      offsetX: -15,
      toolbar: { show: false },
      foreColor: "#adb0bb",
      fontFamily: "inherit",
    },
    grid: {
      show: true,
      borderColor: "transparent",
      strokeDashArray: 2,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "42%",
        endingShape: "rounded",
        borderRadius: 5,
      },
    },
    colors: [primary, secondary],
    fill: { type: "solid", opacity: 1 },
    dataLabels: { enabled: false },
    xaxis: {
      type: "category",
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: function (val: number, { seriesIndex }: any) {
          return seriesIndex === 0 ? `Rs. ${val}/_` : `${val} Orders`;
        },
      },
    },
  };

  return (
    <BaseCard title="Sales Overview">
      <Box className="rounded-bars">
        <Chart options={options} series={series} type="bar" height="295px" />
      </Box>
    </BaseCard>
  );
};

export default SalesOverview;

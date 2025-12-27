"use client";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { IconDotsVertical } from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";
import DashboardCard from "../shared/DashboardCard";
import { cancelPendingRequests } from "@/services/api";

export interface Order {
  id: string;
  orderId: string;
  name: string;
  amount: number;
  time: string;
  color: "primary" | "secondary" | "success" | "warning" | "error";
}

const DailyActivity = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/get-orders?status=paid", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        const now = new Date();

        // Get only today's date range
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(now.setHours(23, 59, 59, 999));

        const todayOrders = data.orders.filter((order: any) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startOfDay && orderDate <= endOfDay;
        });

        const formattedOrders = todayOrders.map((order: any) => {
          const orderDate = new Date(order.createdAt);
          const hours = orderDate.getHours();
          const minutes = orderDate.getMinutes();
          const ampm = hours >= 12 ? "PM" : "AM";
          const formattedTime = `${((hours + 11) % 12) + 1}:${minutes
            .toString()
            .padStart(2, "0")} ${ampm}`;

          return {
            orderId: order.orderId.toString(),
            id: order._id || order.id || Math.random().toString(),
            name: order.name || "Unknown",
            amount: order.amount || 0,
            time: formattedTime,
            color: "success",
          };
        });

        setOrders(formattedOrders.reverse());
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => {
      clearInterval(interval);
      cancelPendingRequests();
    };
  }, []);

  return (
    <DashboardCard
      title="Daily Activity"
      subtitle="Overview of Orders"
      action={
        <>
          <IconButton
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <IconDotsVertical size="21" stroke="1.5" />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClose}>Refresh</MenuItem>
            <MenuItem onClick={handleClose}>Sort</MenuItem>
            <MenuItem onClick={handleClose}>Export</MenuItem>
          </Menu>
        </>
      }
    >
      <Timeline position="alternate">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <TimelineItem key={index}>
              <TimelineOppositeContent>{order.time}</TimelineOppositeContent>

              <TimelineSeparator>
                <TimelineDot color={order.color || "primary"} />
                {index !== orders.length - 1 && <TimelineConnector />}
              </TimelineSeparator>

              <TimelineContent>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  Rs.{order.amount.toFixed(2)} <br /> received from {order.name}
                </Typography>

                <Link
                  href={`/order/${order.id}`}
                  style={{
                    textDecoration: "none",
                    color: "#1976d2",
                    fontSize: "13px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  (Order ID: {order.orderId})
                </Link>
              </TimelineContent>
            </TimelineItem>
          ))
        ) : (
          <TimelineItem>
            <TimelineOppositeContent
              sx={{ flex: 0.2, color: "text.secondary", fontSize: "13px" }}
            >
              --
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="grey" variant="outlined" />
            </TimelineSeparator>
            <TimelineContent>
              <Typography color="text.secondary" fontSize="14px">
                No orders found today
              </Typography>
            </TimelineContent>
          </TimelineItem>
        )}
      </Timeline>
    </DashboardCard>
  );
};

export default DailyActivity;

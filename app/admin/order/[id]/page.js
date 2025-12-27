"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Typography, Paper, Divider, Button, CircularProgress, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { cancelPendingRequests } from "@/services/api";

export default function OrderDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      setError(null);
      try {
        console.log("orderId:: ", id);
        
        const res = await fetch(`/api/get-order?orderId=${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Order not found");
        setOrder(data.order);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
    return () => {
      cancelPendingRequests();
    };
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography color="error" variant="h6">{error}</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => router.back()}>
          <ArrowBackIcon sx={{ mr: 1 }} /> Back
        </Button>
      </Box>
    );
  }

  if (!order) return null;

  return (
    <Box maxWidth="800px" mx="auto" mt={4}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => router.push("/admin/deliverd-order")}>Back to Orders</Button>
        <Typography variant="h4" fontWeight={700} mt={2} mb={1}>
          Order Details
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><b>Order ID:</b> {order.orderId}</Typography>
            <Typography variant="subtitle1"><b>Status:</b> {order.status}</Typography>
            <Typography variant="subtitle1"><b>Delivery Status:</b> {order.deliveryStatus}</Typography>
            <Typography variant="subtitle1"><b>Date:</b> {order.createdAt ? new Date(order.createdAt).toLocaleString() : "-"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1"><b>Name:</b> {order.name}</Typography>
            <Typography variant="subtitle1"><b>Email:</b> {order.email}</Typography>
            <Typography variant="subtitle1"><b>Phone:</b> {order.phone}</Typography>
            <Typography variant="subtitle1"><b>City:</b> {order.city}</Typography>
            <Typography variant="subtitle1"><b>State:</b> {order.state}</Typography>
            <Typography variant="subtitle1"><b>Address:</b> {order.address}</Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" mb={1}>Products</Typography>
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell><b>Product Name</b></TableCell>
                <TableCell><b>Quantity</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order.products && Object.entries(order.products).map(([key, prod]) => (
                <TableRow key={key}>
                  <TableCell>{prod.name || key}</TableCell>
                  <TableCell>{prod.qty || prod.quantity || 1}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="subtitle1"><b>Amount:</b> Rs.{order.amount}/-</Typography>
        {order.discountValue && (
          <Typography variant="subtitle1"><b>Discount:</b> {order.discountValue}</Typography>
        )}
        {order.couponCode && (
          <Typography variant="subtitle1"><b>Coupon Code:</b> {order.couponCode}</Typography>
        )}
        {order.deliveryCharge && (
          <Typography variant="subtitle1"><b>Delivery Charges:</b> {order.deliveryCharge}</Typography>
        )}
        {order.paymentInfo && (
          <Typography variant="subtitle1"><b>Payment Info:</b> {order.paymentInfo}</Typography>
        )}
      </Paper>
    </Box>
  );
} 
"use client";
import Header from "@/app/admin/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/admin/(DashboardLayout)/layout/sidebar/Sidebar";
import LoadingComponent from "@/components/atom/LoadingComponent";
import theme from "@/utils/theme";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Pagination,
  Select,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import BaseCard from "../(DashboardLayout)/components/shared/BaseCard";
import Link from "next/link";
import { cancelPendingRequests } from "@/services/api";
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
const Page = () => {
  const router = useRouter();
  const [month, setMonth] = useState("1");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleChange = (e) => {
    setMonth(e.target.value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warn("Sorry! you are not eligable access this page", {
        position: "bottom-left",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setLoading(false);
      return;
    }
    const fetchUserRoll = async () => {
      try {
        const res = await fetch("/api/get-user", {
          method: "POST",
          body: JSON.stringify({ token }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await res.json();
        if (result.error === "Token expired") {
          toast.warn("Your session expired, login again", {
            position: "bottom-left",
            autoClose: 1000,
            closeOnClick: true,
            pauseOnHover: true,
          });
          return;
        }
        if (result.user.roll !== "admin") {
          router.push("/");
        }
        setLoading(false);
      } catch (error) {
        toast.error("Some internal error occour :", {
          position: "bottom-left",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        console.error("faild to fetch use roll", error);
      }
    };
    fetchUserRoll();
    const fetchPendigOrders = async () => {
      try {
        const res = await fetch("/api/get-confirm-order", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await res.json();
        if (result.proofs) {
          setOrders(result.proofs);
          setLoading(false);
        }
      } catch (error) {
        console.error("some error in pinding orders");
        setLoading(false);
      }
    };

    fetchPendigOrders();
    setLoading(false);
    return () => {
      cancelPendingRequests();
    };
  }, [router]);
  const handleOpen = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const updateStatus = async (orderId, status, deliveryStatus) => {
    try {
      // ✅ Flash Sale Validation - Check if any flash sale items are still valid before approval
      if (status === "paid") {
        const orderRes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/get-order?orderId=${orderId}`);
        const orderData = await orderRes.json();
        
        if (orderData.order) {
          const now = new Date();
          let flashSaleValidationError = null;
          
          for (const [slug, product] of Object.entries(orderData.order.products)) {
            try {
              const productRes = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/getProducts`);
              const productsData = await productRes.json();
              const currentProduct = productsData.products.find(p => p.slug === slug);
              
              if (currentProduct && currentProduct.flashEnd && currentProduct.flashPrice) {
                const flashEndDate = new Date(currentProduct.flashEnd);
                if (now > flashEndDate) {
                  flashSaleValidationError = `Flash sale for ${currentProduct.title} has expired. Cannot approve order.`;
                  break;
                }
                
                // Check if order used flash price but flash sale ended
                if (product.price === currentProduct.flashPrice && now > flashEndDate) {
                  flashSaleValidationError = `Flash sale price for ${currentProduct.title} is no longer valid.`;
                  break;
                }
              }
            } catch (error) {
              console.error("Error validating flash sale:", error);
            }
          }
          
          if (flashSaleValidationError) {
            toast.error(flashSaleValidationError, {
              position: "bottom-left",
              autoClose: 3000,
              closeOnClick: true,
              pauseOnHover: true,
            });
            return;
          }
        }
      }

      // payment-approved
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/update-status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId,
            status,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success("Order Status Updated", {
          position: "bottom-left",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
        setOrders(result);
        // optionally show success toast or update state
      } else {
        toast.error("Sorry Order not Updated", {
          position: "bottom-left",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });
      }
    } catch (error) {
      // console.error("🚨 Error in updateStatus:", error);
      toast.error("Sorry Order not Updated", {
        position: "bottom-left",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  // Fetch orders from DB
  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <MainWrapper className="mainwrapper">
      <Head>
        <title> Confirm - CHAMPION-CHOICE</title>
        <meta
          name="description"
          content="This page was design for only admin in which can Confirm orders of  proudcts here taekwondo unifomrs and other gears of martial arts!"
        />
      </Head>
      <ToastContainer
        position="bottom-left"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />{" "}
      <style jsx global>{`
        .footer,
        .header {
          display: none;
        }
      `}</style>
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper className="page-wrapper">
        {/* <Topbar /> */}

        {/* ------------------------------------------- */}
        {/* Sidebar */}
        {/* ------------------------------------------- */}

        <Sidebar />
        {/* ------------------------------------------- */}
        {/* PageContent */}
        {/* ------------------------------------------- */}
        <Box
          sx={{
            [theme.breakpoints.up("lg")]: {
              marginLeft: "270px",
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Header */}
          {/* ------------------------------------------- */}
          <Header />
          <Container
            sx={{
              paddingTop: "20px",
              maxWidth: "1200px",
              minHeight: "calc(100vh - 240px)",
            }}
          >
            {/* ------------------------------------------- */}
            {/* Page Route */}
            {/* ------------------------------------------- */}
            <Grid container spacing={0}>
              <Grid
                size={{
                  xs: 12,
                  lg: 12,
                }}
              >
                <BaseCard
                  title="Confirm Orders"
                  action={
                    <Select
                      labelId="month-dd"
                      id="month-dd"
                      value={month}
                      size="small"
                      onChange={handleChange}
                    >
                      <MenuItem value={1}>March 2025</MenuItem>
                      <MenuItem value={2}>April 2025</MenuItem>
                      <MenuItem value={3}>May 2025</MenuItem>
                    </Select>
                  }
                >
                  <TableContainer
                    sx={{
                      width: {
                        xs: "274px",
                        sm: "100%",
                      },
                    }}
                  >
                    <Table
                      aria-label="simple table"
                      sx={{
                        whiteSpace: "nowrap",
                        mt: 2,
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Order-Id
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Name
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Amount
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Image
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography color="textSecondary" variant="h6">
                              Date
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography color="textSecondary" variant="h6">
                              Status
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      {orders.length > 0 && (
                        <TableBody>
                          {orders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell>
                                <Typography style={{ color: "blue" }} fontSize="15px" fontWeight={500}>
                                  <Link  href={`/order/${order._id}`}>
                                    {order.orderId}
                                    </Link>
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center">
                                  <Box>
                                    <Typography variant="h6" fontWeight={600}>
                                      {order.name}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>

                              <TableCell>
                                <Typography color="textSecondary" variant="h6">
                                  Rs.{order.amount}/_
                                </Typography>
                                
                                {/* ✅ Complete Price Breakdown */}
                                {order.products && Object.keys(order.products).length > 0 && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" color="textSecondary" display="block">
                                      📊 Order Details:
                                    </Typography>
                                    
                                    {/* Products Breakdown */}
                                    {Object.entries(order.products).map(([slug, product], index) => (
                                      <Box key={index} sx={{ ml: 1, mt: 0.5, borderLeft: '2px solid #e0e0e0', pl: 1 }}>
                                        <Typography variant="caption" color="textSecondary" display="block">
                                          {product.name || product.title} (Qty: {product.qty})
                                        </Typography>
                                        
                                        {/* Final Price */}
                                        <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
                                          Final: Rs.{(product.price * product.qty).toFixed(2)}/-
                                        </Typography>
                                        
                                        {/* Original Price */}
                                        {product.originalPrice && product.originalPrice !== product.price && (
                                          <Typography variant="caption" color="textSecondary" sx={{ ml: 1, textDecoration: 'line-through' }}>
                                            Original: Rs.{(product.originalPrice * product.qty).toFixed(2)}/-
                                          </Typography>
                                        )}
                                        
                                        {/* Flash Sale Badge */}
                                        {product.flashPrice && product.flashPrice !== product.price && (
                                          <Typography variant="caption" color="warning.main" sx={{ ml: 1 }}>
                                            🔥 Flash Sale
                                          </Typography>
                                        )}
                                        
                                        {/* Discount Badge */}
                                        {product.discountPercent && product.discountPercent > 0 && (
                                          <Typography variant="caption" color="info.main" sx={{ ml: 1 }}>
                                            {product.discountPercent}% Off
                                          </Typography>
                                        )}
                                        
                                        {/* Price Type */}
                                        {product.priceType && (
                                          <Typography variant="caption" color="success.main" sx={{ ml: 1 }}>
                                            ({product.priceType})
                                          </Typography>
                                        )}
                                      </Box>
                                    ))}
                                    
                                    {/* Order Summary */}
                                    <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #e0e0e0' }}>
                                      {order.deliveryCharge > 0 && (
                                        <Typography variant="caption" color="textSecondary" display="block">
                                          Delivery: Rs.{order.deliveryCharge}/-
                                        </Typography>
                                      )}
                                      
                                      {order.discountValue > 0 && (
                                        <Typography variant="caption" color="success.main" display="block">
                                          Discount Applied: Rs.{order.discountValue}/-
                                        </Typography>
                                      )}
                                      
                                      {order.couponCode && order.couponCode.trim() !== "" && (
                                        <Typography variant="caption" color="info.main" display="block">
                                          Coupon: {order.couponCode}
                                        </Typography>
                                      )}
                                      
                                      <Typography variant="caption" color="textSecondary" display="block">
                                        Delivery: {order.deliveryMethod || "Not specified"}
                                      </Typography>
                                    </Box>
                                  </Box>
                                )}
                                
                                {/* ✅ Flash Sale Indicator */}
                                {order.products && Object.values(order.products).some(product => 
                                  product.flashPrice && product.flashPrice !== product.price
                                ) && (
                                  <Typography variant="caption" color="error" display="block">
                                    🔥 Flash Sale Items
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  color="primary"
                                  variant="outlined"
                                  onClick={() => handleOpen(order.proofimgurl)}
                                >
                                  View Image
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Typography color="textSecondary" variant="h6">
                                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Button
                                  color="primary"
                                  variant="contained"
                                  onClick={() =>
                                    updateStatus(order.orderId, "paid")
                                  }
                                >
                                  Approve
                                </Button>{" "}
                                <Button
                                  color="error"
                                  variant="contained"
                                  onClick={() =>
                                    updateStatus(order.orderId, "Cancelled")
                                  }
                                >
                                  Reject
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                          <Dialog open={open} onClose={handleClose}>
                            <DialogTitle>Product Image</DialogTitle>
                            <DialogContent>
                              {selectedImage ? (
                                <Image
                                  src={selectedImage}
                                  alt="Order Product"
                                  width={400}
                                  height={300}
                                  style={{
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                  }}
                                />
                              ) : (
                                <Typography>No image found</Typography>
                              )}
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleClose} color="primary">
                                Close
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </TableBody>
                      )}
                      {orders.length == 0 && (
                        <TableBody>
                          <TableRow>
                            <TableCell colSpan={5} align="center">
                              <Typography
                                align="center"
                                fontSize="15px"
                                fontWeight={500}
                              >
                                NO SUCH PENDING ORDERS FOUND
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </BaseCard>
                <Grid
                  size={{
                    xs: 12,
                    lg: 12,
                  }}
                >
                  <Stack
                    className="flex items-center justify-center my-4"
                    spacing={2}
                  >
                    <Pagination count={10} shape="rounded" variant="outlined" />
                  </Stack>
                </Grid>
              </Grid>
            </Grid>{" "}
            {/* ------------------------------------------- */}
            {/* End Page */}
            {/* ------------------------------------------- */}
          </Container>
          {/* ------------------------------------------- */}
          {/* Footer */}
          {/* ------------------------------------------- */}
          {/* <Footer /> */}
        </Box>
      </PageWrapper>
    </MainWrapper>
  );
};

export default Page;

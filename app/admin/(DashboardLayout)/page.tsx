"use client";
import PageContainer from "@/app/admin/(DashboardLayout)/components/container/PageContainer";
import { Box, Grid, Badge, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText, Card, CardContent, Typography, Chip, Grid as MuiGrid } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
// components
import DailyActivity from "@/app/admin/(DashboardLayout)/components/dashboard/DailyActivity";
import SalesOverview from "@/app/admin/(DashboardLayout)/components/dashboard/SalesOverview";
import LoadingComponent from "@/components/atom/LoadingComponent";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MonthlyEarnings from "./components/dashboard/MonthlyEarnings";
import YearlyBreakup from "./components/dashboard/YearlyBreakup";
import TopBlogs from "./components/dashboard/TopBlogs";
import { useAuth } from "@/hooks/useAuth";
import { cancelPendingRequests } from "@/services/api";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { isAdmin } = useAuth();
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!isAdmin || isAdmin === false || !token) {
      router.push("/");
      return;
    }
    // Set loading to false after authentication check
    setLoading(false);
    return () => {
      cancelPendingRequests();
    };
  }, [router, isAdmin]);

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Head>
        <title> Admin Dashboard - CHAMPION-CHOICE</title>
        <meta
          name="description"
          content="this page about admin all feature who give him admin by seneior developer say that we warmly welcome tp admin!"
        />
      </Head>
      <style jsx global>{`
        .footer,
        .header {
          display: none;
        }
      `}</style>
      {isAdmin === true && (
        <Box>
          <Grid container spacing={0}>
            <Grid
              size={{
                xs: 12,
                lg: 12,
              }}
            >
              <SalesOverview />
            </Grid>
            <Grid
              size={{
                xs: 12,
                lg: 4,
              }}
            >
              <DailyActivity />
            </Grid>
            <Grid
              size={{
                xs: 12,
                lg: 4,
              }}
            >
              <YearlyBreakup />
            </Grid>
            <Grid
              size={{
                xs: 12,
                lg: 4,
              }}
            >
              <MonthlyEarnings />
            </Grid>
            <Grid
              size={{
                xs: 12,
                lg: 6,
              }}
            >
              <TopBlogs />
            </Grid>
          </Grid>

        
        </Box>
      )}
    </PageContainer>
  );
};

export default Dashboard;

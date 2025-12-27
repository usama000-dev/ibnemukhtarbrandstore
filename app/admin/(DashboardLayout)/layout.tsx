"use client";
import Sidebar from "@/app/admin/(DashboardLayout)/layout/sidebar/Sidebar";
import { Box, Container, styled } from "@mui/material";
import React from "react";
import Header from "./layout/header/Header";
import theme from "@/utils/theme";
import { useAuth } from "@/hooks/useAuth";

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

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {isAdmin } = useAuth()

  // Show loading while checking admin status
  if (isAdmin === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <MainWrapper className="mainwrapper">
        {/* ------------------------------------------- */}
        {/* Main Wrapper */}
        {/* ------------------------------------------- */}
        <PageWrapper className="page-wrapper">
          {/* <Topbar /> */}
          <Header />
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
              <Box>{children}</Box>
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
  }
  
  // If not admin, redirect or show access denied
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600">You don&apos;t have permission to access this page.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

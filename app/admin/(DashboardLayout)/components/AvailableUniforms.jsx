"use client";
import Header from "@/app/admin/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/admin/(DashboardLayout)/layout/sidebar/Sidebar";
import theme from "@/utils/theme";
import { Box, Container, Grid, styled } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { LuLoader } from "react-icons/lu";
import { FiDownload } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import BaseCard from "./shared/BaseCard";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

const AvailableUniforms = () => {
  const [missingNumbers, setMissingNumbers] = useState([]);
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const router = useRouter();
  const pdfRef = useRef(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
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
        router.push("/");
      }
    };
    fetchUserRoll();
    return () => {
      cancelPendingRequests();
    };
  }, [router]);

  async function findMissingProductNumbers() {
    try {
      setLoading(true);
      const res = await fetch("/api/uniformfindMissing");
      const data = await res.json();

      const uniforms = data;

      if (!Array.isArray(uniforms)) {
        console.error("Invalid data format");
        setLoading(false);
        return;
      }

      // Sare product numbers nikal kar sort kar lo (only valid numbers)
      const productNumbers = uniforms
        .map((item) => parseInt(item.uniformNumberFormat, 10))
        .filter((num) => !isNaN(num))
        .sort((a, b) => a - b);

      setAvailableNumbers(productNumbers);
      // Missing product numbers find karna
      let missing = [];
      let minNum = Math.min(...productNumbers);
      let maxNum = Math.max(...productNumbers);

      for (let i = minNum; i <= maxNum; i++) {
        if (!productNumbers.includes(i)) {
          missing.push(i);
        }
      }
      toast.success("All Uniforms Found Successfully", {
        position: "bottom-left",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      setMissingNumbers(missing);
      setLoading(false);
    } catch (error) {
      toast.error("Please try again !", {
        position: "bottom-left",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  }

  const generatePDF = async () => {
    if (!availableNumbers.length && !missingNumbers.length) {
      toast.error("No data available to download", {
        position: "bottom-left",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      return;
    }

    setPdfLoading(true);
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);
      
      let currentY = margin;
      const lineHeight = 8;
      const titleHeight = 15;
      
      // Add header with date
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Available Uniforms Report', pageWidth / 2, currentY, { align: 'center' });
      currentY += titleHeight;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated on: ${currentDate}`, pageWidth / 2, currentY, { align: 'center' });
      currentY += lineHeight * 2;
      
      // Function to add new page if needed
      const addNewPageIfNeeded = () => {
        if (currentY > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }
      };
      
      // Add available numbers
      if (availableNumbers.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Available Product Numbers:', margin, currentY);
        currentY += lineHeight;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        let numbersPerLine = Math.floor(contentWidth / 15); // Approximate width per number
        let currentLine = '';
        let numbersInCurrentLine = 0;
        
        for (let i = 0; i < availableNumbers.length; i++) {
          addNewPageIfNeeded();
          
          if (numbersInCurrentLine >= numbersPerLine) {
            pdf.text(currentLine, margin, currentY);
            currentY += lineHeight;
            currentLine = '';
            numbersInCurrentLine = 0;
            addNewPageIfNeeded();
          }
          
          currentLine += `${availableNumbers[i]}, `;
          numbersInCurrentLine++;
        }
        
        if (currentLine) {
          pdf.text(currentLine.slice(0, -2), margin, currentY);
          currentY += lineHeight * 2;
        }
        
        pdf.text(`Total Available: ${availableNumbers.length}`, margin, currentY);
        currentY += lineHeight * 2;
      }
      
      // Add missing numbers
      if (missingNumbers.length > 0) {
        addNewPageIfNeeded();
        
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Missing Product Numbers:', margin, currentY);
        currentY += lineHeight;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        let numbersPerLine = Math.floor(contentWidth / 15);
        let currentLine = '';
        let numbersInCurrentLine = 0;
        
        for (let i = 0; i < missingNumbers.length; i++) {
          addNewPageIfNeeded();
          
          if (numbersInCurrentLine >= numbersPerLine) {
            pdf.text(currentLine, margin, currentY);
            currentY += lineHeight;
            currentLine = '';
            numbersInCurrentLine = 0;
            addNewPageIfNeeded();
          }
          
          currentLine += `${missingNumbers[i]}, `;
          numbersInCurrentLine++;
        }
        
        if (currentLine) {
          pdf.text(currentLine.slice(0, -2), margin, currentY);
          currentY += lineHeight * 2;
        }
        
        pdf.text(`Total Missing: ${missingNumbers.length}`, margin, currentY);
      }
      
      // Save the PDF
      const fileName = `uniforms_report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.success("PDF downloaded successfully!", {
        position: "bottom-left",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Error generating PDF. Please try again.", {
        position: "bottom-left",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } finally {
      setPdfLoading(false);
    }
  };

  // SEO Data
  const seoData = {
    title: "Available Uniforms Inventory Management | Champion Choice Admin",
    description: "Comprehensive inventory management system for martial arts uniforms. Track available and missing uniform numbers, generate reports, and manage stock efficiently. Admin dashboard for Champion Choice.",
    keywords: "uniform inventory management, martial arts uniforms, taekwondo uniforms, stock management, admin dashboard, champion choice, inventory tracking, uniform numbers, missing uniforms, available uniforms",
    url: "https://www.champzones.com/admin/available-uniforms",
    image: "/images/championchoice-logo.png",
    type: "website"
  };

  // Structured Data for Admin Dashboard
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Available Uniforms Inventory Management",
    "description": "Admin dashboard for managing martial arts uniform inventory, tracking available and missing uniform numbers, and generating comprehensive reports.",
    "url": seoData.url,
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "Champion Choice Inventory Management System",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web Browser",
      "description": "Comprehensive inventory management system for martial arts uniforms and equipment",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "PKR"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Champion Choice",
      "url": "https://www.champzones.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.champzones.com/images/championchoice-logo.png"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.champzones.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Admin",
          "item": "https://www.champzones.com/admin"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Available Uniforms",
          "item": seoData.url
        }
      ]
    }
  };

  return (
    <MainWrapper className="mainwrapper">
      <Head>
        {/* Primary Meta Tags */}
        <title>{seoData.title}</title>
        <meta name="title" content={seoData.title} />
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="author" content="Champion Choice" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={seoData.url} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={seoData.type} />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.image} />
        <meta property="og:site_name" content="Champion Choice" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={seoData.url} />
        <meta property="twitter:title" content={seoData.title} />
        <meta property="twitter:description" content={seoData.description} />
        <meta property="twitter:image" content={seoData.image} />
        <meta property="twitter:site" content="@championchoice" />
        <meta property="twitter:creator" content="@championchoice" />
        
        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#DD8560" />
        <meta name="msapplication-TileColor" content="#DD8560" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Champion Choice Admin" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
        
        {/* Additional Security Headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/images/championchoice-logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/championchoice-logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/championchoice-logo.png" />
        <link rel="manifest" href="/manifest.json" />
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
      />
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
            <Box>
              <Grid item xs={12} lg={12}>
                <BaseCard title="Find All Uniform">
                  <div className="p-6 flex flex-col text-center">
                    {/* Buttons */}
                    <div className="flex flex-col gap-4 mb-4">
                      {loading == true && (
                        <button
                          disabled
                          className="flex-1 flex items-center justify-center bg-gradient-to-r from-[#DD8560] to-[#fbbf24] px-20 py-2 hover:bg-black-600 transition-all"
                        >
                          <LuLoader className="animate-spin" />
                        </button>
                      )}
                      {loading == false && (
                        <button
                          onClick={findMissingProductNumbers}
                          className="flex-1 bg-gradient-to-r from-[#DD8560] to-[#fbbf24] text-white font-[100] px-4 py-2 hover:bg-black-600 transition-all"
                        >
                          FIND MISSING NUMBERS
                        </button>
                      )}
                      
                      {/* Download PDF Button */}
                      {(availableNumbers.length > 0 || missingNumbers.length > 0) && (
                        <button
                          onClick={generatePDF}
                          disabled={pdfLoading}
                          className="flex-1 bg-green-600 text-white font-[100] px-4 py-2 hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                        >
                          {pdfLoading ? (
                            <LuLoader className="animate-spin" />
                          ) : (
                            <FiDownload />
                          )}
                          {pdfLoading ? "Generating PDF..." : "Download PDF"}
                        </button>
                      )}
                    </div>

                    {/* Table */}
                    <div className="flex flex-row space-x-2">
                      {missingNumbers.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">
                                  Missing Product Numbers ({missingNumbers.length}
                                  )
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {missingNumbers.map((num, index) => (
                                <tr
                                  key={index}
                                  className="bg-white hover:bg-gray-100"
                                >
                                  <td className="border border-gray-400 px-4 py-2">
                                    Numbers: {num}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      {availableNumbers.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr className="bg-gray-200">
                                <th className="border border-gray-400 px-4 py-2">
                                  Available Product Numbers (
                                  {availableNumbers.length})
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {availableNumbers.map((num, index) => (
                                <tr
                                  key={index}
                                  className="bg-white hover:bg-gray-100"
                                >
                                  <td className="border border-gray-400 px-4 py-2">
                                    Numbers: {num}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </BaseCard>
              </Grid>
            </Box>
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

export default AvailableUniforms;

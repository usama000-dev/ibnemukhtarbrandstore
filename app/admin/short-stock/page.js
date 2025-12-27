"use client"
import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";
import { FiDownload } from "react-icons/fi";
import { cancelPendingRequests } from "@/services/api";

function ShortStockPageContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    fetchShortStock();
    return () => {
      cancelPendingRequests();
    };
  }, []);

  const fetchShortStock = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_HOST || 'http://localhost:3001';
      const productsRes = await axios.get(`${baseUrl}/api/getProducts`);
      const allProducts = productsRes.data?.products || [];
      const shortStockProducts = allProducts.filter(product => {
        if (!product) return false;
        const availability = product.availability || 0;
        return availability < 10;
      });
      setProducts(shortStockProducts);
    } catch (error) {
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadProductsPDF = async () => {
    setPdfLoading(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      doc.setFontSize(18);
      doc.text('Short Stock Report - Products', pageWidth / 2, 15, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 23, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Total Products: ${products.length}`, 14, 32);

      const columns = [
        { header: 'Product', dataKey: 'title' },
        { header: 'Category', dataKey: 'category' },
        { header: 'Size', dataKey: 'size' },
        { header: 'Color', dataKey: 'color' },
        { header: 'Stock', dataKey: 'availability' },
        { header: 'Price', dataKey: 'price' }
      ];

      const rows = products.map(product => ({
        title: product.title || 'No Title',
        category: product.category || 'N/A',
        size: product.size || 'N/A',
        color: product.color || 'N/A',
        availability: product.availability || 0,
        price: `Rs. ${product.price || 0}`
      }));

      doc.autoTable({
        startY: 36,
        head: [columns.map(col => col.header)],
        body: rows.map(row => columns.map(col => row[col.dataKey])),
        theme: 'grid',
        headStyles: { fillColor: [33, 150, 243] },
        styles: { fontSize: 9 },
        didDrawPage: (data) => {
          if (data.pageNumber > 1) {
            doc.setFontSize(18);
            doc.text('Short Stock Report - Products', pageWidth / 2, 15, { align: 'center' });
          }
        }
      });

      doc.save(`short_stock_products_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("PDF downloaded successfully!", { position: "bottom-left", autoClose: 1000 });
    } catch (error) {
      toast.error("Error generating PDF.", { position: "bottom-left", autoClose: 1000 });
    } finally {
      setPdfLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button onClick={() => { setError(null); fetchShortStock(); }} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Short Stock Management</h1>
          <p className="text-gray-600">Monitor products with quantity less than 10</p>
        </div>
        <button
          onClick={handleDownloadProductsPDF}
          disabled={pdfLoading || products.length === 0}
          className="bg-gradient-to-r from-[#DD8560] to-[#fbbf24] text-white font-semibold px-6 py-2 rounded shadow hover:from-[#c77550] hover:to-yellow-400 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {pdfLoading ? <LuLoader className="animate-spin" /> : <span className="flex gap-1 items-center justify-center"><FiDownload /> Download PDF</span>}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Low Stock Products ({products.length})</h2>
        </div>
        {products.length === 0 ? (
          <div className="p-6 text-center text-gray-500">No products with low stock found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {product.images?.[0] ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">No img</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.title || 'No Title'}</div>
                          <div className="text-sm text-gray-500">{product.slug || 'No Slug'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.category || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.size || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.color || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${(product.availability || 0) === 0 ? 'text-red-800 bg-red-100' : 'text-orange-800 bg-orange-100'}`}>
                        {product.availability || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rs. {product.price || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  if (hasError) return <div className="p-6 text-red-600">Something went wrong. Please reload.</div>;
  return <div onError={() => setHasError(true)}>{children}</div>;
}

export default function ShortStockPage() {
  return (
    <ErrorBoundary>
      <ShortStockPageContent />
    </ErrorBoundary>
  );
}
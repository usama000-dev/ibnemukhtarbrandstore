"use client";
import { LuLoader } from "react-icons/lu";
import { FiDownload } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import Image from "next/image";
import CalculatePrice from "@/utils/priceCalculator";
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useFacebookPixel } from "@/hooks/useFacebookPixel";

export default function OrderPage({ params, order }) {
  const { trackPurchase } = useFacebookPixel();
  trackPurchase(order);

  const orderRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!order) {
    return <div>Order not found</div>;
  }

  const downloadPDF = async () => {
    if (!orderRef.current) return;

    setIsGenerating(true);
    try {
      const element = orderRef.current;
      const clone = element.cloneNode(true);
      clone.style.position = "absolute";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.width = element.offsetWidth + "px";
      document.body.appendChild(clone);

      // Convert element to canvas
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      document.body.removeChild(clone);

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210; // A4 width
      const pageHeight = 297; // A4 height
      const margin = 10; // padding from all sides
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = margin;

      // Add first page
      pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - margin * 2;

      // Add more pages if content is longer
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + margin;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - margin * 2;
      }

      pdf.save(`order_${order.name}_${order.orderId}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="text-gray-600 body-font overflow-hidden">
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
      <div className="container px-5 py-24 mx-auto">
        <div ref={orderRef} className="relative">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <div className="">
              <h1 className="text-gray-900 text-2xl title-font font-[500] mb-2">
                Order Detail
              </h1>
              {/* PDF Download Button - placed outside the captured area */}
              <div className="text-center absolute top-15 right-1">
                <button
                  onClick={downloadPDF}
                  disabled={isGenerating}
                  className={`text-white bg-black flex gap-1 items-center font-[200] border-0 py-2 px-6 focus:outline-none hover:bg-green-700 hover:cursor-pointer rounded ${isGenerating ? "bg-green opacity-90 cursor-not-allowed" : ""}`}
                >
                  {isGenerating ? (
                    <LuLoader className="animate-spin" />
                  ) : (
                    <FiDownload />
                  )}
                  {isGenerating ? "Generating PDF..." : "Download PDF"}
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h2 className="text-[10px] title-font text-gray-500 tracking-widest">
                CHAMPIONCHOICE
              </h2>
              <h3 className="text-gray-900 text-xl title-font font-medium mb-2">
                Order Id: {order.orderId}
              </h3>
              <p className="leading-relaxed mb-4 text-[14px]">
                Your order placed on:{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <div className="flex mb-4 font-semibold border-b pb-2">
                <span className="flex-grow text-center">Item Description</span>
                <span className="flex-grow text-center">Quantity</span>
                <span className="flex-grow text-center">Item Total</span>
              </div>

              {Object.entries(order.products).map(([key, product]) => (
                <div
                  key={key}
                  className="flex border-t border-gray-200 py-2 items-center"
                >
                  <span className="w-1/3 text-gray-900 text-sm">
                    ({product.uniformNumberFormat || "*"}):
                    {product.title || product.company} ({product.size || "Mis"}/
                    {product.color || product?.category?.toUpperCase() || "Mis"}
                    )
                  </span>
                  <span className="w-1/3 text-center text-gray-700">
                    {product.qty || 1}
                  </span>
                  <span className="w-1/3 text-center text-gray-700">
                    Rs.
                    {product.qty
                      ? product.qty * product.price
                      : CalculatePrice(product)}
                    /-
                  </span>
                </div>
              ))}

              <div className="flex flex-col mt-6 space-y-4">
                <span className="title-font font-medium text-2xl text-gray-900">
                  Total: Rs.{order.amount}/-
                </span>
                <p className="text-sm text-gray-600">Status: {order.status}</p>
                <p className="text-sm text-gray-600">
                  Delivery Status: {order.deliveryStatus}
                </p>
                <button className="text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-gray-600 rounded">
                  {order.status == "paid" ? "Thanks!" : "Track Order"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center lg:w-1/2 w-full lg:pl-10">
              <Image
                src={order.deliveryVoucher || "/images/championchoice-logo.png"}
                alt={order.name}
                width={300}
                height={300}
                className="rounded"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

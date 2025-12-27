"use client";

import BorderSection from "@/components/atom/BorderSection";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingComponent from "../../components/atom/LoadingComponent";
import { cancelPendingRequests } from "@/services/api";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("this week");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("/api/all-orders", {
      method: "POST",
      body: JSON.stringify({ token }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.orders) {
          setOrders(data.orders);
        }
        setLoading(false);
      });
      return () => {
        cancelPendingRequests();
      };
  }, []);

  const filterOrders = () => {
    let filtered = [...orders];

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (order) => order.status?.toLowerCase() === selectedStatus
      );
    }

    // NOTE: Duration filter logic (e.g., last 3 months) can be implemented later if needed
    return filtered;
  };

  if (loading) {
    return <LoadingComponent />;
  }

  const filteredOrders = filterOrders();

  return (
    <section className="bg-white py-8 antialiased md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <div className="mx-auto max-w-5xl">
          <div className="gap-4 sm:flex sm:items-center sm:justify-between">
            <h2 className="mt-12 text-center md:mt-0 text-xl font-semibold text-gray-900 sm:text-2xl">
              My orders
            </h2>
            <BorderSection className="pt-1" />
            <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
              <div>
                <label
                  htmlFor="order-type"
                  className="sr-only mb-2 block text-sm font-medium text-gray-900"
                >
                  Select order type
                </label>
                <select
                  id="order-type"
                  className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All orders</option>
                  <option value="pre-order">Pre-order</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <span className="inline-block text-gray-500"> from </span>
              <div>
                <label
                  htmlFor="duration"
                  className="sr-only mb-2 block text-sm font-medium text-gray-900"
                >
                  Select duration
                </label>
                <select
                  id="duration"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                >
                  <option value="this week">this week</option>
                  <option value="this month">this month</option>
                  <option value="last 3 months">last 3 months</option>
                  <option value="last 6 months">last 6 months</option>
                  <option value="this year">this year</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 flow-root sm:mt-8">
            <div className="divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <div
                    key={order._id || index}
                    className="flex flex-wrap items-center gap-y-4 py-6"
                  >
                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500">
                        Order ID:
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900">
                        <a href={`/order/${order._id}`} className="hover:underline">
                          {order.orderId || order._id}
                        </a>
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500">
                        Date:
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500">
                        Price:
                      </dt>
                      <dd className="mt-1.5 text-base font-semibold text-gray-900">
                        Rs.{order.amount || "0"}/_
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500">
                        Status:
                      </dt>
                      <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                        {order.status || "N/A"}
                      </dd>
                    </dl>

                    <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
                      <dt className="text-base font-medium text-gray-500">
                        Delivery Status:
                      </dt>
                      <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800">
                        {order.deliveryStatus || "N/A"}
                      </dd>
                    </dl>

                    <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
                      {order.deliveryStatus !== "deliverd" && (
                        <button
                          type="button"
                          className="w-full rounded-lg border border-[#DD8560] px-3 py-2 text-center text-sm font-medium text-[#DD8560] hover:bg-[#DD8560]/90 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 lg:w-auto"
                        >
                          Track order
                        </button>
                      )}
                      <Link
                        href={`/order/${order._id}`}
                        className="w-full inline-flex justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 lg:w-auto"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-black py-4 text-center">
                  No orders found for selected filter.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrdersPage;

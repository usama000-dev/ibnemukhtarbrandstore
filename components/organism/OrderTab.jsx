import Link from "next/link";
import { FiShoppingBag } from "react-icons/fi";
import BorderSection from "../atom/BorderSection";
import Image from 'next/image';

const OrdersTab = ({ orders }) => (
  <div>
    <h2 className="text-xl text-center font-semibold mb-6">My Orders</h2>
    <BorderSection className="-mt-4"/>
    {orders.length === 0 ? (
      <div className="text-center py-12">
        <FiShoppingBag className="mx-auto text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600 mb-4">You haven not placed any orders yet</p>
        <Link
          href="/"
          className="text-[#DD8560] hover:text-[#DD8560]/90 font-medium"
        >
          Browse Products
        </Link>
      </div>
    ) : (
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium">Order #{order.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.date).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "shipped"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "processing"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex -space-x-2">
                {Object.entries(order.products).map((item, idx) => (
                  <Image
                    key={idx}
                    src={item.imgUrl}
                    alt={item.name}
                    width={50}
                    height={50}
                    className="rounded"
                  />
                ))}
                {Object.entries(order.products).length > 3 && (
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs">
                    +{Object.entries(order.products).length - 3}
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm">
                  {Object.entries(order.products).length} items
                </p>
                <p className="text-sm text-gray-500">
                  {Object.entries(order.products)[0].name}
                  {Object.entries(order.products).length > 1
                    ? ` and ${Object.entries(order.products).length - 1} more`
                    : ""}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t">
              <p className="font-medium">Rs.{order.amount.toFixed(2)}/_</p>
              <Link
                href={`/order/${order._id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
export default OrdersTab;

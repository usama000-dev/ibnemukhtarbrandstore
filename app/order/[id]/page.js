import { track } from "@vercel/analytics/react";
import LoadingComponent from "../../../components/atom/LoadingComponent";
import OrderDetailPage from "../../../components/organism/OrderPageCmpnt";
import { connectDb } from '@/middleware/mongodb';
import { Order } from "../../../models/Order";

export const dynamic = "force-dynamic"; // Add this line to disable static prerendering

export const metadata = {
  title: "Premium Martial Arts Gear & Equipment | CHAMPION-CHOICE",
  description: "Shop top-quality martial arts uniforms, protective gear...",
  keywords: ["martial arts gear", "karate uniforms", "taekwondo equipment"],
};

export default async function Page({ params }) {
  const { id } = await params;
  await connectDb();
  const order = await Order.findOne({ _id: id.trim() }).lean();
  // console.log("order in order page: ",order);
  // console.log("order id is : ",id);

  const safeOrder = JSON.parse(JSON.stringify(order));
  if (!order) {
    return <LoadingComponent />;
  }
  return <OrderDetailPage params={id} order={safeOrder} />;
}

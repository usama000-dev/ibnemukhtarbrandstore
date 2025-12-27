import {
  IconCancel,
  IconCircleDashedPlus,
  IconClipboardSearch,
  IconDeviceIpadCheck,
  IconEye,
  IconHome,
  IconListCheck,
  IconShoppingCart,
  IconShoppingCartPlus,
  IconTicket,
  IconTrendingUp,
  IconTruckDelivery,
  IconUsers,
  IconArticle,
  IconAlertTriangle,
  IconSettings,
  IconFlag,
  IconReport,
  IconFilePlus,
} from "@tabler/icons-react";
import { uniqueId } from "lodash";

interface MenuitemsType {
  [x: string]: any;
  id?: string;
  navlabel?: boolean;
  subheader?: string;
  title?: string;
  icon?: any;
  href?: string;
  children?: MenuitemsType[];
  chip?: string;
  chipColor?: string;
  variant?: string;
  external?: boolean;
}

const Menuitems: MenuitemsType[] = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconHome,
    href: "/admin",
  },
  {
    id: uniqueId(),
    title: "Video Ads",
    icon: IconAlertTriangle, // Using Alert or similar for visibility, or IconArticle
    href: "/admin/ads",
  },
  {
    id: uniqueId(),
    title: "Blog",
    icon: IconArticle,
    href: "/admin/blog",
  },

  // Manage Products parent
  {
    id: uniqueId(),
    title: "Manage Products",
    icon: IconSettings,
    href: "#",
    children: [
      {
        id: uniqueId(),
        title: "Add Product",
        icon: IconCircleDashedPlus,
        href: "/admin/addProduct",
      },
      {
        id: uniqueId(),
        title: "All Products",
        icon: IconClipboardSearch,
        href: "/admin/allProducts",
      },
      {
        id: uniqueId(),
        title: "Update Products",
        icon: IconSettings,
        href: "/admin/manage-products",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "Stock",
    icon: IconReport,
    href: "/admin/short-stock",
  },
  // Coupons parent
  {
    id: uniqueId(),
    title: "Coupons",
    icon: IconTicket,
    href: "#",
    children: [
      {
        id: uniqueId(),
        title: "Coupons",
        icon: IconTicket,
        href: "/admin/coupons",
      },
      {
        id: uniqueId(),
        title: "Create Coupon",
        icon: IconCircleDashedPlus,
        href: "/admin/creat-coupon",
      },
    ],
  },
  //Email Compaign Managment System

  {
    id: uniqueId(),
    title: "ECMS",
    icon: IconReport,
    href: "#",
    bgcolor: "error",
    children: [
      {
        id: uniqueId(),
        title: "Email Dashboard",
        icon: IconFilePlus,
        href: "/admin/email-dashboard",
      },
      {
        id: uniqueId(),
        title: "Subscribers",
        icon: IconUsers,
        href: "/admin/email-subscribers",
      },
      {
        id: uniqueId(),
        title: "Campaigns",
        icon: IconFilePlus,
        href: "/admin/email-campaigns",
      },
    ],
  },
  // Orders parent
  {
    id: uniqueId(),
    title: "Orders",
    icon: IconShoppingCart,
    href: "#",
    bgcolor: "error",
    children: [
      {
        id: uniqueId(),
        title: "Create Orders",
        icon: IconFilePlus,
        href: "/admin/create-orders",
      },
      {
        id: uniqueId(),
        title: "Unshifted",
        icon: IconDeviceIpadCheck,
        href: "/admin/unshifted-Orders",
      },
      {
        id: uniqueId(),
        title: "Pending",
        icon: IconTrendingUp,
        href: "/admin/pendings",
        chip: "",
      },
      {
        id: uniqueId(),
        title: "Deliverd",
        icon: IconTruckDelivery,
        href: "/admin/deliverd-order",
      },
      {
        id: uniqueId(),
        title: "Cancelled",
        icon: IconCancel,
        href: "/admin/cencle-order",
      },
    ],
  },
  {
    id: uniqueId(),
    title: "users",
    icon: IconUsers,
    href: "/admin/all-users",
  },
];

export default Menuitems;

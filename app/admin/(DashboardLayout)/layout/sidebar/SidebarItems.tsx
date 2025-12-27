import React, { useContext } from "react";
import { usePathname } from "next/navigation";
import { Box } from "@mui/material";
import {
  Logo as MuiLogo,
  Sidebar as MUI_Sidebar,
  Menu,
  MenuItem,
  Submenu,
} from "react-mui-sidebar";

import Menuitems from "./MenuItems";
import Link from "next/link";
import Logo from "@/components/atom/Logo";

import { IconPoint } from "@tabler/icons-react";
import Upgrade from "./Updrade";
import { DashboardContext } from "@/app/context/DashboardContext";

const RenderMenuItems = (items: any[], pathDirect: string) => {
const {pendingOrdersLength} = useContext(DashboardContext)
  return items.map((item) => {
    const Icon = item.icon ? item.icon : IconPoint;
    const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

    if (item.subheader) {
      // Display Subheader
      return (
        <Box sx={{ margin: "0 -24px" }} key={item.subheader}>
          <Menu subHeading={item.subheader} key={item.subheader}>
            <></>
          </Menu>
        </Box>
      );
    }

    //If the item has children (submenu)
    if (item.children) {
      return (
        <Submenu key={item.id} title={item.title} icon={itemIcon}>
          {RenderMenuItems(item.children, pathDirect)}
        </Submenu>
      );
    }

    // If the item has no children, render a MenuItem

    return (
      <MenuItem
      key={item.id}
      isSelected={pathDirect === item?.href}
      icon={itemIcon}
      component={Link}
      link={item.href && item.href !== "" ? item.href : "#"}
      target={item.href && item.href.startsWith("https") ? "_blank" : "_self"}
      badge={item.title === "Confirm Order" ? true : item.chip ? true : false}
      badgeContent={
        item.title === "Confirm Order"
          ? pendingOrdersLength?.toString() || "0"
          : item.chip || ""
      }
      badgeColor="secondary"
      disabled={item.disabled}
    >
      {item.title}
    </MenuItem>
    
    );
  });
};

const SidebarItems = () => {
  const pathname = usePathname();
  const pathDirect = pathname;

  return (
    <Box sx={{ px: "20px", overflowX: "hiddbloen" }}>
      <MUI_Sidebar
        width={"100%"}
        showProfile={false}
        themeColor="#1e4db7"
        themeSecondaryColor="#1a97f51a"
      >
        <div className="flex items-center justify-start my-8">
          <Logo 
            width={100} 
            height={50} 
            showLink={true}
          />
        </div>
        {RenderMenuItems(Menuitems, pathDirect)}
      </MUI_Sidebar>
    </Box>
  );
};

export default SidebarItems;

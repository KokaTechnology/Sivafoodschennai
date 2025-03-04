import React from "react";
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  useProSidebar,
  sidebarClasses,
} from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../theme";
import CategoryIcon from "@mui/icons-material/Category";
import SubtitlesIcon from "@mui/icons-material/Subtitles";
import GroupIcon from "@mui/icons-material/Group";
import ArtTrackIcon from "@mui/icons-material/ArtTrack";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { IconButton, Typography, useMediaQuery } from "@mui/material";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PaymentIcon from "@mui/icons-material/Payment";
import ViewCarouselIcon from "@mui/icons-material/ViewCarousel";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import InfoIcon from "@mui/icons-material/Info";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import RateReviewIcon from "@mui/icons-material/RateReview";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import NextWeekIcon from "@mui/icons-material/NextWeek";
import ContentPasteGoIcon from "@mui/icons-material/ContentPasteGo";
import "../Styles/sidebar.css";
import { AccountBalanceWallet } from "@mui/icons-material";
import DescriptionIcon from "@mui/icons-material/Description";

const Links = ({ title, to, icon, location, collapsed }) => {
  return (
    <Link to={to} style={{ all: "unset" }}>
      <MenuItem
        style={collapsed ? { paddingLeft: "20%" } : { paddingLeft: "10%" }}
        active={to === location}
        icon={icon}
      >
        <Typography variant="h5">{title}</Typography>
      </MenuItem>
    </Link>
  );
};

function Sidebar() {
  const Uselocation = useLocation();
  const location = Uselocation.pathname.replace("/", "");
  const matches = useMediaQuery("(max-width:767px)");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { collapseSidebar, collapsed } = useProSidebar();
  const admin = JSON.parse(sessionStorage.getItem("admin"));

  const links = [
    {
      name: "Delivery Report",
      to: "DeliveryReport",
      icon: function () {
        return <QueryStatsIcon />;
      },
    },
    {
      name: "Upcoming Orders",
      to: "upcoming-orders",
      icon: function () {
        return <NextWeekIcon />;
      },
    },
    {
      name: "Upcoming Subs",
      to: "upcoming-subs-orders",
      icon: function () {
        return <ContentPasteGoIcon />;
      },
    },
    {
      name: "Categories",
      to: "Categories",
      icon: function () {
        return <CategoryIcon />;
      },
    },
    {
      name: "Subcategory",
      to: "Subcategory",
      icon: function () {
        return <SubtitlesIcon />;
      },
    },
    {
      name: "Products",
      to: "Products",
      icon: function () {
        return <ArtTrackIcon />;
      },
    },
    {
      name: "Users",
      to: "Users",
      icon: function () {
        return <GroupIcon />;
      },
    },
    {
      name: "Drivers",
      to: "Drivers",
      icon: function () {
        return <DirectionsBikeIcon />;
      },
    },
    {
      name: "Orders",
      to: "Orders",
      icon: function () {
        return <LocalMallIcon />;
      },
    },
    {
      name: "Transaction",
      to: "Transaction",
      icon: function () {
        return <PaymentIcon />;
      },
    },
    {
      name: "Banners",
      to: "Banners",
      icon: function () {
        return <ViewCarouselIcon />;
      },
    },
    {
      name: "About-Us",
      to: "About-Us",
      icon: function () {
        return <InfoIcon />;
      },
    },
    {
      name: "Privicy",
      to: "Privicy",
      icon: function () {
        return <ManageAccountsIcon />;
      },
    },
    {
      name: "Terms",
      to: "Terms",
      icon: function () {
        return <LibraryBooksIcon />;
      },
    },
    {
      name: "Pincode",
      to: "Pincode",
      icon: function () {
        return <AddLocationAltIcon />;
      },
    },
    {
      name: "Testimonial",
      to: "Testimonial",
      icon: function () {
        return <RateReviewIcon />;
      },
    },
    {
      name: "Setting",
      to: "Setting",
      icon: function () {
        return <SettingsIcon />;
      },
    },
    {
      name: "Notification",
      to: "Notification",
      icon: function () {
        return <NotificationsActiveIcon />;
      },
    },
    {
      name: "Low Wallet Notification",
      to: "Low-Wallet-Notification",
      icon: function () {
        return <AccountBalanceWallet />;
      },
    },
    {
      name: "Web App Setting",
      to: "web-app-setting",
      icon: function () {
        return <i class="fa-brands fa-chrome"></i>;
      },
    },
    {
      name: "Invoice Setting",
      to: "invoice-setting",
      icon: function () {
        return <DescriptionIcon />;
      },
    },
    {
      name: "Delivery Location",
      to: "delivery-location",
      icon: function () {
        return <i class="fa-solid fa-street-view"></i>;
      },
    },
    {
      name: "Payment Getway",
      to: "payment-getway",
      icon: function () {
        return <i class="fa-brands fa-paypal"></i>;
      },
    },
    {
      name: "Social Media",
      to: "social-media",
      icon: function () {
        return <i class="fa-regular fa-thumbs-up"></i>;
      },
    },
  ];

  return (
    <div className="sideBar">
      <Box height={"100vh"}>
        <ProSidebar
          defaultCollapsed={matches}
          backgroundColor={colors.navbarBG[400]}
          height={"100vh"}
          paddingBottom={"50px"}
          rootStyles={{
            [`.${sidebarClasses.container}`]: {
              height: "100vh",
            },
            [`.${sidebarClasses.root}`]: {
              borderRight: "none !important",
            },
          }}
        >
          <Menu
            menuItemStyles={{
              button: ({ level, active, disabled }) => {
                // only apply styles on first level elements of the tree
                if (level === 0)
                  return {
                    height: "40px",
                    color: disabled ? "#f5d9ff" : "#d359ff",
                    backgroundColor: active ? "#6870fa" : undefined,
                    "&:hover": {
                      backgroundColor: "transparent !important",
                    },
                  };
              },
            }}
          >
            <MenuItem
              onClick={() => collapseSidebar()}
              style={{
                margin: "10px 0 0 0",
                color: "#fff !important",
              }}
            >
              {collapsed ? (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  color="#fff !important"
                >
                  <IconButton onClick={() => collapseSidebar()}>
                    <MenuOutlinedIcon
                      onClick={() => collapseSidebar()}
                      color="sideText"
                    />
                  </IconButton>
                </Box>
              ) : (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="10px"
                >
                  <Typography variant="h3" color={"#FFF"}>
                    Basket App
                  </Typography>
                  <IconButton onClick={() => collapseSidebar()}>
                    <MenuOutlinedIcon
                      onClick={() => collapseSidebar()}
                      color="sideText"
                    />
                  </IconButton>
                </Box>
              )}
            </MenuItem>
          </Menu>
          <Menu
            iconShape="square"
            menuItemStyles={{
              button: ({ level, active, disabled }) => {
                // only apply styles on first level elements of the tree
                if (level === 0)
                  return {
                    height: "50px",
                    color: active
                      ? `${colors.selectedText[100]} !important`
                      : `${colors.text[100]} !important`,
                    backgroundColor: active ? colors.selected[100] : undefined,
                    "&:hover": {
                      backgroundColor: `${colors.selected[100]} !important`,
                      color: `${colors.selectedText[100]} !important`,
                    },
                  };
              },
            }}
          >
            {/* Admin details */}
            {!collapsed && (
              <Box pl="12%" pb="5px" borderBottom="0.5px solid #fcfcfc">
                <Box textAlign="left">
                  <Typography variant="h6" color={colors.greenAccent[500]}>
                    {admin?.email}
                  </Typography>
                  <Typography variant="h6" color={colors.greenAccent[500]}>
                    {admin?.role[0].role_title}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* menu Items */}
            <Box mt="1px">
              {links.map((m) => (
                <Links
                  title={m.name}
                  to={m.to}
                  icon={m.icon()}
                  location={location}
                  collapsed={collapsed}
                />
              ))}
            </Box>
          </Menu>
        </ProSidebar>
      </Box>
    </div>
  );
}

export default Sidebar;

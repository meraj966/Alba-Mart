import * as React from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Settings from "@mui/icons-material/Settings";
import BookOnlineOutlinedIcon from "@mui/icons-material/BookOnlineOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../appStore";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidenav() {
  const navigate = useNavigate();
  const open = useAppStore((state) => state.dopen);

  const SideNavListItem = ({
    navigationUrl,
    Icon,
    label,
    onClick = () => navigate(navigationUrl),
  }) => (
    <ListItem
      disablePadding
      sx={{ display: "block" }}
      onClick={onClick}
    >
      <ListItemButton
        sx={{
          minHeight: 48,
          justifyContent: open ? "initial" : "center",
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          {Icon}
        </ListItemIcon>
        <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
      </ListItemButton>
    </ListItem>
  );

  const handleLogout = async () => {
    window.localStorage.setItem("token", "")
      navigate("/")
  }

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader></DrawerHeader>
      <List>
        <SideNavListItem
          label={"Dashboard"}
          Icon={<DashboardIcon />}
          navigationUrl={"/Dashboard"}
        />
        <SideNavListItem
          label={"Products"}
          Icon={<ShoppingCartIcon />}
          navigationUrl={"/products"}
        />
        <SideNavListItem
          label={"Users"}
          Icon={<GroupIcon />}
          navigationUrl={"/users"}
        />
        <SideNavListItem
          label={"Orders"}
          Icon={<ListAltIcon />}
          navigationUrl={"/orders"}
        />
        <SideNavListItem
          label={"Promo Code"}
          Icon={<BookOnlineOutlinedIcon />}
          navigationUrl={"/promo-codes"}
        />
        <SideNavListItem
          label={"Delivery Slot"}
          Icon={<LocalShippingIcon />}
          navigationUrl={"/delivery_slot"}
        />
        <SideNavListItem
          label={"Delivery Boy"}
          Icon={<PersonAddIcon />}
          navigationUrl={"/delivery_boy"}
        />
        <SideNavListItem
          label={"Offer Settings"}
          Icon={<LocalOfferIcon />}
          navigationUrl={"/offer-settings"}
        />
        <SideNavListItem
          label={"Delivery Charges"}
          Icon={<CurrencyRupeeIcon />}
          navigationUrl={"/delivery_charge"}
        />
        <SideNavListItem
          label={"Settings"}
          Icon={<Settings />}
          navigationUrl={"/settings"}
        />
        <SideNavListItem
          label={"Terms & Conditions"}
          Icon={<MenuBookIcon />}
          navigationUrl={"/terms_and_conditions"}
        />
        <SideNavListItem
          label={"F & Q"}
          Icon={<QuestionAnswerIcon />}
          navigationUrl={"/f_and_q"}
        />
        <SideNavListItem
          label={"Logout"}
          Icon={<LogoutIcon />}
          navigationUrl={"/"}
          onClick={handleLogout}
        />
      </List>
    </Drawer>
  );
}

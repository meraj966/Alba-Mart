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
import SendIcon from "@mui/icons-material/Send";
import PolicyIcon from "@mui/icons-material/Policy";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import CategoryIcon from "@mui/icons-material/Category";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import * as URLS from "../urls";
import { useContext } from "react";
import { AppContext } from "../context";
import { isAdminUser, userHasViewAccessToRoute } from "../authentication/utils";

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
  const { userInfo } = useContext(AppContext);
  const open = useAppStore((state) => state.dopen);

  const SideNavListItem = ({
    navigationUrl,
    Icon,
    label,
    hasAccess,
    onClick = () => navigate(navigationUrl),
  }) =>
    hasAccess ? (
      <ListItem disablePadding sx={{ display: "block" }} onClick={onClick}>
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
    ) : null;

  const handleLogout = async () => {
    window.localStorage.setItem("token", "");
    navigate("/");
  };

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader></DrawerHeader>
      <List>
        <SideNavListItem
          label={"Dashboard"}
          Icon={<DashboardIcon />}
          navigationUrl={URLS.DASHBOARD_URL}
          hasAccess={userHasViewAccessToRoute(userInfo, URLS.DASHBOARD_URL)}
        />
        <SideNavListItem
          label={"Products"}
          Icon={<ShoppingCartIcon />}
          navigationUrl={URLS.PRODUCTS_URL}
          hasAccess={userHasViewAccessToRoute(userInfo, URLS.PRODUCTS_URL)}
        />
        <SideNavListItem
          label={"Variant"}
          Icon={<AutoAwesomeMotionIcon />}
          navigationUrl={URLS.VARIANT_URL}
          hasAccess={userHasViewAccessToRoute(userInfo, URLS.VARIANT_URL)}
        />
        <SideNavListItem
          label={"Users"}
          Icon={<GroupIcon />}
          navigationUrl={URLS.USERS_URL}
          hasAccess={userHasViewAccessToRoute(userInfo, URLS.PRODUCTS_URL)}
        />
        <SideNavListItem
          label={"Orders"}
          Icon={<ListAltIcon />}
          navigationUrl={URLS.ORDERS_URL}
          hasAccess={userHasViewAccessToRoute(userInfo, URLS.ORDERS_URL)}
        />
        <SideNavListItem
          label={"Promo Code"}
          Icon={<BookOnlineOutlinedIcon />}
          navigationUrl={URLS.PROMOCODE_URL}
          hasAccess={userHasViewAccessToRoute(userInfo, URLS.PROMOCODE_URL)}
        />
        <SideNavListItem
          label={"Delivery Slot"}
          Icon={<LocalShippingIcon />}
          navigationUrl={URLS.DELIVERY_SLOT_URL}
          hasAccess={userHasViewAccessToRoute(userInfo, URLS.DELIVERY_SLOT_URL)}
        />
        <SideNavListItem
          label={"Delivery Boy"}
          Icon={<PersonAddIcon />}
          navigationUrl={URLS.DELIVERY_BOY_URL}
          hasAccess={userHasViewAccessToRoute(userInfo, URLS.DELIVERY_BOY_URL)}
        />
        <SideNavListItem
          label={"Offer Settings"}
          Icon={<LocalOfferIcon />}
          navigationUrl={URLS.OFFER_SETTINGS_URL}
          hasAccess={userHasViewAccessToRoute(
            userInfo,
            URLS.OFFER_SETTINGS_URL
          )}
        />
        <SideNavListItem
          label={"Delivery Charges"}
          Icon={<CurrencyRupeeIcon />}
          navigationUrl={URLS.DELIVERY_CHARGE_URL}
          hasAccess={userHasViewAccessToRoute(
            userInfo,

            URLS.DELIVERY_CHARGE_URL
          )}
        />
        <SideNavListItem
          label={"Category"}
          Icon={<CategoryIcon />}
          navigationUrl={URLS.CATEGORY_URL}
          hasAccess={userHasViewAccessToRoute(userInfo, URLS.CATEGORY_URL)}
        />
        <SideNavListItem
          label={"Admin"}
          Icon={<AdminPanelSettingsIcon />}
          navigationUrl={URLS.ADMIN_URL}
          hasAccess={isAdminUser(userInfo)}
        />
        <SideNavListItem
          label={"Settings"}
          Icon={<Settings />}
          navigationUrl={URLS.SETTINGS_URL}
          hasAccess={userHasViewAccessToRoute(userInfo, URLS.SETTINGS_URL)}
        />
        <SideNavListItem
          label={"Terms & Conditions"}
          Icon={<MenuBookIcon />}
          navigationUrl={URLS.TERMS_AND_CONDITIONS_URL}
          hasAccess={userHasViewAccessToRoute(
            userInfo,
            URLS.TERMS_AND_CONDITIONS_URL
          )}
        />
        <SideNavListItem
          label={"F & Q"}
          Icon={<QuestionAnswerIcon />}
          navigationUrl={URLS.FAQ_URL}
          hasAccess={userHasViewAccessToRoute(userInfo, URLS.FAQ_URL)}
        />
        <SideNavListItem
          label={"Send Notification"}
          Icon={<SendIcon />}
          navigationUrl={URLS.PUSH_NOTIFICATION_URL}
          hasAccess={userHasViewAccessToRoute(
            userInfo,
            URLS.PUSH_NOTIFICATION_URL
          )}
        />
        <SideNavListItem
          label={"Privacy & Policy"}
          Icon={<PolicyIcon />}
          navigationUrl={URLS.PRIVACY_POLICY_URL}
          hasAccess={userHasViewAccessToRoute(
            userInfo,
            URLS.PRIVACY_POLICY_URL
          )}
        />
        <SideNavListItem
          label={"Contact Us"}
          Icon={<ContactPhoneIcon />}
          navigationUrl={URLS.CONTACT_US_URL}
          hasAccess={userHasViewAccessToRoute(userInfo, URLS.CONTACT_US_URL)}
        />
        <SideNavListItem
          label={"Logout"}
          Icon={<LogoutIcon />}
          navigationUrl={URLS.HOME_URL}
          onClick={handleLogout}
          hasAccess={true}
        />
      </List>
    </Drawer>
  );
}

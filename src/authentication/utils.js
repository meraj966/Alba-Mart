import * as URLS from "../urls";

export const PAGE_LEVEL = "PAGE_LEVEL";
export const CONTROL_LEVEL = "CONTROL_LEVEL";
export const USER_TYPE_ADMIN = "ADMIN";
export const USER_TYPE_WORKER = "WORKER";

export const generalAccessURLS = [];

export const pageToAccessKeyMapping = {
  [URLS.DASHBOARD_URL]: "VIEW_DASHBOARD",
  [URLS.USERS_URL]: "VIEW_USERS",
  [URLS.ORDERS_URL]: "VIEW_ORDERS",
  [URLS.PROMOCODE_URL]: "VIEW_PROMOCODE",
  [URLS.DELIVERY_SLOT_URL]: "VIEW_DELIVERY_SLOT",
  [URLS.DELIVERY_BOY_URL]: "VIEW_DELIVERY_BOY",
  [URLS.OFFER_SETTINGS_URL]: "VIEW_OFFER_SETTINGS",
  [URLS.DELIVERY_CHARGE_URL]: "VIEW_DELIVERY_CHARGES",
  [URLS.CATEGORY_URL]: "VIEW_CATEGORY",
  [URLS.SETTINGS_URL]: "VIEW_SETTINGS",
  [URLS.TERMS_AND_CONDITIONS_URL]: "VIEW_TERMS_AND_CONDITIONS",
  [URLS.PUSH_NOTIFICATION_URL]: "VIEW_NOTIFICATIONS",
  [URLS.PRIVACY_POLICY_URL]: "VIEW_PRIVACY_SETTINGS",
  [URLS.CONTACT_US_URL]: "VIEW_CONTACT_US",
  [URLS.ADMIN_URL]: "ADMIN",
};

export const userHasViewAccessToRoute = (userInfo, keyMapping, route) => {
  if (!userInfo?.pageLevelAccess || !keyMapping?.pageLevel || !route)
    return null;
  const pageLevelAccessKeys = userInfo?.pageLevelAccess?.map(
    (key) => keyMapping?.pageLevel[key]
  );
  return pageLevelAccessKeys.includes(pageToAccessKeyMapping[route]);
};

export const isAdminUser = (userInfo) => {
  return userInfo?.userType == USER_TYPE_ADMIN;
};

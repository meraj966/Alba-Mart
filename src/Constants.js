export const CATEGORY = "CATEGORY";
export const SUBCATEGORY = "SUBCATEGORY";
export const BRAND_NAME = "BRAND_NAME";
export const DELIVERY_CHARGE_CRITERIA = "DELIVERY_CHARGE_CRITERIA";
export const PRODUCTS_LOW_STOCK = "PRODUCTS_LOW_STOCK";
export const PRODUCTS_UNAVAILABLE = "PRODUCTS_UNAVAILABLE";
export const ORDER_TYPE_DROPDOWN_VALUES = [
  {
    label: "All Orders",
    value: "All Orders",
  },
  {
    label: "Awaiting",
    value: "Awaiting",
  },
  {
    label: "Received",
    value: "Received",
  },
  {
    label: "Processed",
    value: "Processed",
  },
  {
    label: "Shipped",
    value: "Shipped",
  },
  {
    label: "Ready to Pickup",
    value: "Ready to Pickup",
  },
  {
    label: "Delivered",
    value: "Delivered",
  },
  {
    label: "Cancelled",
    value: "Cancelled",
  },
  {
    label: "Returned",
    value: "Returned",
  },
];
export const CONDITION = {
  EQUALS: "EQUALS",
  NOT_EQUAL: "NOT EQUAL",
  LESS_THAN: "LESS THAN",
  LESS_THAN_OR_EQUALS: "LESS THAN OR EQUALS",
  GREATER_THAN: "GREATER THAN",
  GREATER_THAN_OR_EQUALS: "GREATER THAN OR EQUALS",
  IN_RANGE: "IN RANGE",
};
export const DELIVERY_CHARGE_TABLE_HEADERS = [
  "No.",
  "Criteria",
  "Condition",
  "Value",
  "Delivery Charge",
];

export const CATEGORY = "CATEGORY";
export const SUBCATEGORY = "SUBCATEGORY";
export const BRAND_NAME = "BRAND_NAME";
export const DELIVERY_CHARGE_CRITERIA = "DELIVERY_CHARGE_CRITERIA";
export const PRODUCTS_LOW_STOCK = "PRODUCTS_LOW_STOCK";
export const PRODUCTS_UNAVAILABLE = "PRODUCTS_UNAVAILABLE";
export const ORDER_TYPE_DROPDOWN_VALUES = [
  {
    label: "All Orders",
    value: 0,
  },
  {
    label: "Awaiting",
    value: 1,
  },
  {
    label: "Received",
    value: 2,
  },
  {
    label: "Processed",
    value: 3,
  },
  {
    label: "Shipped",
    value: 4,
  },
  {
    label: "Ready to Pickup",
    value: 5,
  },
  {
    label: "Delivered",
    value: 6,
  },
  {
    label: "Cancelled",
    value: 7,
  },
  {
    label: "Returned",
    value: 8,
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
    'No.', 'Criteria', 'Condition', 'Value', 'Delivery Charge'
]
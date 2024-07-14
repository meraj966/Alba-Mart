export const CATEGORY = "CATEGORY";
export const SUBCATEGORY = "SUBCATEGORY";
export const BRAND_NAME = "BRAND_NAME";
export const PRODUCTS_LOW_STOCK = "PRODUCTS_LOW_STOCK";
export const PRODUCTS_UNAVAILABLE = "PRODUCTS_UNAVAILABLE";
export const ORDER_TYPE_DROPDOWN_VALUES = [
  {
    label: <span style={{ color: 'black' }}>All Orders</span>,
    value: "All Orders",
  },
  {
    label: <span style={{ color: 'blue' }}>Placed</span>,
    value: "placed",
  },
  // {
  //   label: <span style={{ color: 'orange' }}>Received</span>,
  //   value: "Received",
  // },
  {
    label: <span style={{ color: 'orange' }}>Processing</span>,
    value: "processing",
  },
  {
    label: <span style={{ color: 'purple' }}>Shipped</span>,
    value: "shipped",
  },
  // {
  //   label: <span style={{ color: 'red' }}>Ready to Pickup</span>,
  //   value: "Ready to Pickup",
  // },
  {
    label: <span style={{ color: 'green' }}>Delivered</span>,
    value: "delivered",
  },
  {
    label: <span style={{ color: 'red' }}>Cancelled</span>,
    value: "canceled",
  },
  {
    label: <span style={{ color: 'brown' }}>Returned</span>,
    value: "returned",
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

export const PAGE_LEVEL = "PAGE_LEVEL"
export const CONTROL_LEVEL = "CONTROL_LEVEL"
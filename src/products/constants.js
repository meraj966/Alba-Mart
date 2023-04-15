export const PRODUCT_DATA_GRID_COLUMNS = [
  {
    field: "name",
    headerName: "Name",
    minWidth: 200,
    flex:1
},

  {
    field: "price",
    headerName: "MRP",
    minWidth: 100,
    flex:1

  },
  {
    field: "salePrice",
    headerName: "Sale Price",
    minWidth: 100,
    flex:1

  },
  {
    field: "discountValue",
    headerName: "Discount",
    flex:1,
    // minWidth: 150,
    valueGetter: ({ row }) => {
      return `${row.onSale ? `${row.saleValue} ${row.saleType}` : "-"}`;
    },
  },
  {
    field: "stockValue",
    headerName: "Stock Value",
    minWidth: 100,
    flex:1,
    valueGetter: ({ row }) => row.stockValue || '-'
  },
  {
    field: "quantity",
    headerName: "Quantity",
    minWidth: 100,
    flex:1
  },
  {
    field: "isProductLive",
    headerName: "Is Product Live",
    minWidth: 100,
    flex:1,
    valueGetter: ({ row }) => row.showProduct ? 'Yes' : 'No'
  },
  {
    field: "action",
    flex:1,
    headerName: "Action",
    minWidth: 100,
  },
];

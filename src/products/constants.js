import { Stack } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import DeleteIcon from "@mui/icons-material/Delete";
import { map, sum } from "lodash";
import { Link } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export const getProductDataGridColumns = (
  open,
  openProductPreview,
  selectedProd,
  editData,
  deleteProduct
) => {
  return [
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
    },

    {
      field: "price",
      headerName: "MRP",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "salePrice",
      headerName: "Sale Price",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "discountValue",
      headerName: "Discount",
      flex: 1,
      // minWidth: 150,
      valueGetter: ({ row }) => {
        return `${row.onSale ? `${row.saleValue} ${row.saleType}` : "-"}`;
      },
    },
    {
      field: "stockValue",
      headerName: "Stock Value",
      minWidth: 100,
      flex: 1,
      valueGetter: ({ row }) => row.stockValue || "-",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "isProductLive",
      headerName: "Is Product Live",
      minWidth: 100,
      flex: 1,
      valueGetter: ({ row }) => (row.showProduct ? "Yes" : "No"),
    },
    {
      field: "action",
      flex: 1,
      headerName: "Action",
      minWidth: 100,
      renderCell: ({ row }) => (
        <Stack direction={"row"} spacing={2}>
          <PreviewIcon
            style={{
              fontSize: "20px",
              cursor: "pointer",
              color: open && selectedProd.id === row.id ? "black" : "gray",
            }}
            onClick={() => openProductPreview(row)}
          />
          <EditIcon
            style={{
              fontSize: "20px",
              color: "#1976d2",
              cursor: "pointer",
            }}
            className="cursor-pointer"
            onClick={() => {
              editData(row);
            }}
          />
          <DeleteIcon
            style={{
              fontSize: "20px",
              color: "darkred",
              cursor: "pointer",
            }}
            onClick={() => {
              deleteProduct(row);
            }}
          />
        </Stack>
      ),
    },
  ];
};

export const getOrdersGridColumns = (
  users,
  isEdit,
  statusDropdown,
  deliveryBoy
) => {
  const getUserByOrder = (order) => users.find((i) => i.user === order.userID);

  return [
    {
      field: "orderId",
      headerName: "Order ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Cust Name",
      flex: 1,
      valueGetter: ({ row }) => getUserByOrder(row)?.name,
    },
    {
      field: "phoneNo",
      headerName: "Customer Contact",
      flex: 1,
      valueGetter: ({ row }) => getUserByOrder(row)?.phoneNo,
    },
    {
      field: "amount",
      headerName: "Total Amount",
      flex: 1,
      valueGetter: ({ row }) => sum(map(Object.values(row.products), "amount")),
    },
    {
      field: "paymentMode",
      headerName: "Payment Mode",
      flex: 1,
      valueGetter: ({ row }) => row.paymentMode || "--",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      valueGetter: (data) =>
        isEdit ? statusDropdown(data.id, data.row) : data.row?.orderStatus,
    },
    {
      headerName: "Delivery Boy",
      flex: 1,
      valueGetter: ({ row }) =>
        deliveryBoy?.find((i) => i.id === row.deliveryBoy)?.name || "-",
    },
    {
      headerName: "Options",
      flex: 1,
      field: "s",
      renderCell: ({ row }) => (
        <Link
          to={`/order-details/${row.orderId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <OpenInNewIcon />
        </Link>
      ),
    },
  ];
};

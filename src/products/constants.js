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
      field: "category",
      headerName: "Category",
      minWidth: 150,
      flex: 1,
    },

    {
      field: "url",
      headerName: "Prod Img",
      minWidth: 150,
      flex: 1,
      valueGetter: (params) => params.row.url[0], // Get the URL of the first image in the `url` array
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Product"
          style={{ maxWidth: "90px", maxHeight: "50px" }}
          />
      ),
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
      field: "purchaseRate",
      headerName: "Purchase Rate",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "discountValue",
      headerName: "Discount",
      minWidth: 100,
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
      valueGetter: ({ row }) => `${row.quantity} ${row.measureUnit}`
    },
    {
      field: "barcode",
      headerName: "Barcode",
      minWidth: 100,
      flex: 1,
      valueGetter: ({ row }) => row.barcode || "-",
    },
    {
      field: "isProductLive",
      headerName: "Is Product Live",
      minWidth: 100,
      flex: 1,
      valueGetter: ({ row }) => (row.showProduct ? "Active" : "Deactive"),
      renderCell: ({ row }) => (
        <span
          style={{
            color: row.showProduct ? "green" : "red",
            border: "1px solid",
            padding: "4px",
            borderRadius: "4px",
          }}
        >
          {row.showProduct ? "Active" : "Deactive"}
        </span>
      ),
    },
    {
      field: "action",
      flex: 1,
      headerName: "Action",
      minWidth: 100,
      renderCell: ({ row }) => (
        <Stack direction={"row"} spacing={2}>
          {/* <PreviewIcon
            style={{
              fontSize: "20px",
              cursor: "pointer",
              color: open && selectedProd.id === row.id ? "black" : "gray",
            }}
            onClick={() => openProductPreview(row)}
          /> */}
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
      // valueGetter: ({ row }) => sum(map(Object.values(row.products), "amount")),
      valueGetter: ({ row }) => {
        if (!row || !row.products) {
          return 0; // Return a default value or handle the error appropriately
        }
      
        const productValues = Object.values(row.products);
      
        if (!productValues) {
          return 0; // Return a default value or handle the error appropriately
        }
      
        const amounts = productValues.map(product => product.amount);
        const totalAmount = amounts.reduce((total, amount) => total + amount, 0);
        
        return totalAmount;
      }      
    },
    {
      field: "paymentMode",
      headerName: "Payment Mode",
      flex: 1,
      valueGetter: ({ row }) => row.paymentType || "--",
    },
    {
      field: "orderDate",
      headerName: "Order Date",
      flex: 1,
      valueGetter: ({ row }) => {
        if (row.orderDate) {
          const dateArray = row.orderDate.split(" ");
          return dateArray[0]; // This will give you the date part "2023-08-30"
        }
        return "--";
      },
    },
    {
      field: "orderTime",
      headerName: "Order Time",
      flex: 1,
      valueGetter: ({ row }) => {
        if (row.orderDate) {
          const timePart = row.orderDate.split(" ")[1];
          if (timePart) {
            // Extract only the hours and minutes
            const hoursMinutes = timePart.substr(0, 5); // This will give you "11:59"
            return hoursMinutes;
          }
        }
        return "--";
      },
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

import { Stack } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import PreviewIcon from "@mui/icons-material/Preview";
import DeleteIcon from "@mui/icons-material/Delete";

export const getProductDataGridColumns = (
  open,
  openProductPreview,
  editData,
  deleteProduct,
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
              color: open ? "black" : "gray",
            }}
            onClick = {() => openProductPreview(row)}
            />
          <EditIcon
            style={{
              fontSize: "20px",
              color: "#1976d2",
              cursor: "pointer",
            }}
            className="cursor-pointer"
            onClick={() => {
              editData(
                row.id,
                row.name,
                row.price,
                row.subCategory,
                row.category
              );
            }}
          />
          <DeleteIcon
            style={{
              fontSize: "20px",
              color: "darkred",
              cursor: "pointer",
            }}
            onClick={() => {
              deleteProduct();
            }}
          />
        </Stack>
      ),
    },
  ];
};

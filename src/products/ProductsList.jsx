import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Modal from "@mui/material/Modal";
import EditForm from "./EditForm";
import Skeleton from "@mui/material/Skeleton";
import { useAppStore } from "../appStore";
import AddProducts from "./AddProducts";
import ProductPopup from "./resuable/ProductPopup";
import { Grid } from "@mui/material";
import Product from "./resuable/Product";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ProductsList() {
  const rows = useAppStore((state) => state.rows);
  const setRows = useAppStore((state) => state.setRows);
  const menuRef = collection(db, "Menu");
  const [formid, setFormid] = useState("");
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const handleBulkOpen = () => setBulkOpen(true);
  const handleBulkClose = () => setBulkOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  console.log("product list", rows)
  useEffect(() => {
    getMenuData();
  }, []);

  const getMenuData = async () => {
    const data = await getDocs(menuRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const filterData = (v) => {
    if (v) {
      setRows([v]);
    } else {
      getMenuData();
    }
  };

  return (
    <>
      <div>
        <Modal open={bulkOpen} sx={{ margin: "auto" }}>
          <Box
            sx={{
              ...style,
              overflow: "scroll",
              maxHeight: "70%",
              width: "80%",
            }}
          >
            <AddProducts closeEvent={handleBulkClose} />
          </Box>
        </Modal>
        <Modal
          open={editopen}
          // onClose={handleEditClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style} className="editForm">
            <EditForm closeEvent={handleEditClose} fid={formid} />
          </Box>
        </Modal>
      </div>

      <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ padding: "20px" }}
        >
          Products List
        </Typography>
        <Divider />
        <Box height={10} />
        <Stack direction="row" spacing={2} className="my-2 mb-2">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={rows}
            sx={{ width: 300 }}
            onChange={(e, v) => filterData(v)}
            getOptionLabel={rows=>rows.name}
            renderInput={(params) => (
              <TextField {...params} size="small" label="Search Products" />
            )}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <Button
            variant="contained"
            endIcon={<AddCircleIcon />}
            onClick={handleBulkOpen}
          >
            Add Product
          </Button>
        </Stack>
        <Box height={10} />
        {rows.length > 0 && (
          <>
            {console.log(rows)}
            <TableContainer>
              <Table stickyHeader aria-label="Products">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="left">Price</TableCell>
                    <TableCell align="left">Category</TableCell>
                    <TableCell align="left">Sub Category</TableCell>
                    <TableCell align="left">Created At</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    return (
                      <Product
                        data={row}
                        {...row}
                        setFormid={setFormid}
                        handleEditOpen={handleEditOpen}
                        deleteProd={getMenuData}
                      />
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Paper>

      {rows.length == 0 && (
        <>
          <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
            <Box height={20} />
            <Skeleton variant="rectangular" width={"100%"} height={30} />
            <Box height={40} />
            <Skeleton variant="rectangular" width={"100%"} height={60} />
            <Box height={20} />
            <Skeleton variant="rectangular" width={"100%"} height={60} />
            <Box height={20} />
            <Skeleton variant="rectangular" width={"100%"} height={60} />
            <Box height={20} />
            <Skeleton variant="rectangular" width={"100%"} height={60} />
            <Box height={20} />
            <Skeleton variant="rectangular" width={"100%"} height={60} />
            <Box height={20} />
          </Paper>
        </>
      )}
    </>
  );
}

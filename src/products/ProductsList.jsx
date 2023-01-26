import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Modal from "@mui/material/Modal";
import AddForm from "./AddForm";
import EditForm from "./EditForm";
import Skeleton from "@mui/material/Skeleton";
import { useAppStore } from "../appStore";
import BulkAddForm from "./BulkAddForm";
import Product from "./resuable/Product";
import { Grid } from "@mui/material";

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [rows, setRows] = useState([]);
  const rows = useAppStore((state) => state.rows);
  const setRows = useAppStore((state) => state.setRows);
  const empCollectionRef = collection(db, "Menu");
  const [formid, setFormid] = useState("");
  const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleBulkOpen = () => setBulkOpen(true);
  const handleBulkClose = () => setBulkOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditClose = () => setEditOpen(false);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const data = await getDocs(empCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const filterData = (v) => {
    if (v) {
      setRows([v]);
    } else {
      getUsers();
    }
  };

  

  return (
    <>
      <div>
        <Modal
          open={open}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <AddForm closeEvent={handleClose} />
          </Box>
        </Modal>
        <Modal
          open={bulkOpen}
          sx={{ margin: 'auto' }}
        >
          <Box sx={{ ...style, overflow: 'scroll', maxHeight: '70%', width: '80%' }}>
            <BulkAddForm closeEvent={handleBulkClose} />
          </Box>
        </Modal>
        <Modal
          open={editopen}
          // onClose={handleEditClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
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
            getOptionLabel={(rows) => rows.name || ""}
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
            Bulk Add
          </Button>
          <Button
            variant="contained"
            endIcon={<AddCircleIcon />}
            onClick={handleOpen}
          >
            Add
          </Button>
        </Stack>
        <Box height={10} />
        {rows.length > 0 && (
          <>
            {console.log(rows)}
            <Grid container spacing={1}>
              {rows.map((row) => {
                console.log("in rows")
                return <Grid item xs={4}>
                  <Product
                  data = {row}
                   {...row}
                   setFormid={setFormid}
                   handleEditOpen={handleEditOpen}
                   deleteProd={getUsers}
                  />
                </Grid>
              })}
            </Grid>
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

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
    const [editopen, setEditOpen] = useState(false);
    const handleOpen = () => setOpen(true);
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

    const deleteUser = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.value) {
                deleteApi(id);
            }
        });
    };

    const deleteApi = async (id) => {
        const userDoc = doc(db, "Menu", id);
        await deleteDoc(userDoc);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        getUsers();
    };

    const filterData = (v) => {
        if (v) {
            setRows([v]);
        } else {
            getUsers();
        }
    };

    const editData = (id, name, price, subCategory, category) => {
        const data = {
            id: id,
            name: name,
            price: price,
            subCategory: subCategory,
            category: category,
        };
        setFormid(data);
        handleEditOpen();
    };

    return (
        <>
        {rows.length > 0 && (
            <TableContainer>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left" style={{ minWidth: "100px" }}>
                      Name
                    </TableCell>
                    <TableCell align="left" style={{ minWidth: "100px" }}>
                      Price
                    </TableCell>
                    <TableCell align="left" style={{ minWidth: "100px" }}>
                      Category
                    </TableCell>
                    <TableCell align="left" style={{ minWidth: "100px" }}>
                      Sub Category
                    </TableCell>
                    <TableCell align="left" style={{ minWidth: "100px" }}>
                      Pic
                    </TableCell>
                    <TableCell align="left" style={{ minWidth: "100px" }}>
                      Created At
                    </TableCell>
                    <TableCell align="left" style={{ minWidth: "100px" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row.code}
                        >
                          <TableCell align="left">{row.name}</TableCell>
                          <TableCell align="left">{String(row.price)}</TableCell>
                          <TableCell align="left">
                            {String(row.category)}
                          </TableCell>
                          <TableCell align="left">
                            {String(row.subCategory)}
                          </TableCell>
                          <TableCell align="left">
                            <img
                              src={row.file}
                              height="70px"
                              width="70px"
                              style={{borderRadius:"15px"}}
                              loading="lazy"
                            />
                          </TableCell>
                          <TableCell align="left">{String(row.date)}</TableCell>
                          <TableCell align="left">
                            <Stack spacing={2} direction="row">
                              <EditIcon
                                style={{
                                  fontSize: "20px",
                                  color: "blue",
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
                                  deleteUser(row.id);
                                }}
                              />
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
      </>
    );
  }
  
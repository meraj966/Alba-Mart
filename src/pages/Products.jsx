import React, { useState } from "react";
import Box from "@mui/material/Box";
import ProductsList from "../products/ProductsList";
import "../Dash.css";
import { useEffect } from "react";
import { useAppStore } from "../appStore";
import PageTemplate from "./reusable/PageTemplate";
import {
  Modal,
  Stack,
  Autocomplete,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import AddProducts from "../products/AddProducts";
import EditForm from "../products/EditForm";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { BOX_STYLE } from "./reusable/Styles";

export default function Products() {
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
      <PageTemplate
        title="Products List"
        modal={
          <div>
            <Modal open={bulkOpen} sx={{ margin: "auto" }}>
              <Box
                sx={{
                  ...BOX_STYLE,
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
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={BOX_STYLE} className="editForm">
                <EditForm closeEvent={handleEditClose} fid={formid} />
              </Box>
            </Modal>
          </div>
        }
        actionBar={
          <Stack direction="row" spacing={2} className="my-2 mb-2">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={rows}
              sx={{ width: 300 }}
              onChange={(e, v) => filterData(v)}
              getOptionLabel={(rows) => rows.name}
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
        }
      >
        <ProductsList
          rows={rows}
          setFormid={setFormid}
          handleEditOpen={handleEditOpen}
          deleteProd={getMenuData}
        />
      </PageTemplate>
    </>
  );
}

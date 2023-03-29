import React, { useState } from "react";
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
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function Coupans() {
  const rows = useAppStore((state) => state.rows);
  const setRows = useAppStore((state) => state.setRows);
  const menuRef = collection(db, "Menu");

  useEffect(() => {
    getMenuData();
  }, []);

  const getMenuData = async () => {
    const data = await getDocs(menuRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  return (
    <>
      <PageTemplate
        title="Coupan List"
        actionBar={
          <Stack direction="row" spacing={2} className="my-2 mb-2">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={rows}
              sx={{ width: 300 }}
              getOptionLabel={(rows) => rows.name}
              renderInput={(params) => (
                <TextField {...params} size="small" label="Search Coupan" />
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
            >
              Add Coupan
            </Button>
          </Stack>
        }
      >
        {/* <CoupanList
          rows={rows}
          setFormid={setFormid}
          handleEditOpen={handleEditOpen}
          deleteProd={getMenuData}
        /> */}
      </PageTemplate>
    </>
  );
}

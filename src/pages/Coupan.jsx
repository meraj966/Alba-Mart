import React, { useState } from "react";
import "../Dash.css";
import { useEffect } from "react";
import { useAppStore } from "../appStore";
import PageTemplate from "./reusable/PageTemplate";
import {
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function Coupans() {

  return (
    <>
      <PageTemplate
        title="Coupan List"
        actionBar={
          <Stack direction="row" spacing={2} className="my-2 mb-2">
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

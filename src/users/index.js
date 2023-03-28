import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import { useAppStore } from "../appStore";
import UsersList from "../users/components/UsersList";
import "../Dash.css";
import Stack from "@mui/material/Stack";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import PageTemplate from "../pages/reusable/PageTemplate";

export default function Users() {
  // const [rows, setRows] = useState([]);
  const rows = useAppStore((state) => state.rows);
  const setRows = useAppStore((state) => state.setRows);
  const empCollectionRef = collection(db, "Users");
  const filterData = (v) => {
    if (v) {
      setRows([v]);
    } else {
      getUsers();
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const data = await getDocs(empCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const actionBar = () => (
    <Stack direction="row" spacing={2} className="my-2 mb-2">
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={rows}
        sx={{ width: 300 }}
        onChange={(e, v) => filterData(v)}
        getOptionLabel={(rows) => rows.name || ""}
        renderInput={(params) => (
          <TextField {...params} size="small" label="Search Users" />
        )}
      />
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1 }}
      ></Typography>
    </Stack>
  );
  return (
    <>
      <PageTemplate title="Users List" actionBar={actionBar()}>
        <UsersList rows={rows} />
      </PageTemplate>
    </>
  );
}

import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import { useAppStore } from "../appStore";
import UsersList from "../users/components/UsersList";
import "../Dash.css";
import Stack from "@mui/material/Stack";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import PageTemplate from "../pages/reusable/PageTemplate";
import ExcelJS from "exceljs/dist/exceljs.min.js"; // Import ExcelJS

export default function Users() {
  const [options, setOptions] = useState([]);
  const rows = useAppStore((state) => state.rows);
  const setRows = useAppStore((state) => state.setRows);
  const empCollectionRef = collection(db, "UserProfile");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const data = await getDocs(empCollectionRef);
    const uniqueValues = [
      ...new Set(data.docs.flatMap((doc) => Object.values(doc.data()))),
    ];
    setOptions(uniqueValues);
    setRows(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  // Function to handle exporting data to Excel using ExcelJS
  const handleExportToExcel = () => {
    if (rows.length > 0) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("UserList");

      // Define the headers you want to export
      const headers = ["Name", "Email", "Phone", "Pincode", "Address"];

      // Add headers to the worksheet
      worksheet.addRow(headers);

      // Map the user data to include only the desired fields
      const mappedData = rows.map((row) => ({
        Name: row.primaryName || "",
        Email: row.primaryEmail || "",
        Phone: row.primaryContact || "",
        Pincode: row.pin || "",
        Address: row.address || "",
      }));

      // Add data rows to the worksheet
      mappedData.forEach((row) => {
        worksheet.addRow(Object.values(row));
      });

      // Generate a Blob containing the Excel file
      workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);

        // Create a download link and trigger the download
        const a = document.createElement("a");
        a.href = url;
        a.download = "user_list.xlsx";
        a.click();
        window.URL.revokeObjectURL(url);
      });
    }
  };

  const filterData = (v) => {
    if (v) {
      const filteredRows = rows.filter((row) =>
        Object.values(row).includes(v)
      );
      setRows(filteredRows);
    } else {
      getUsers();
    }
  };

  const actionBar = () => (
    <Stack direction="row" spacing={2} className="my-2 mb-2">
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={options}
        sx={{ width: 300 }}
        onChange={(e, v) => filterData(v)}
        renderInput={(params) => (
          <TextField {...params} size="small" label="Search Users" />
        )}
      />
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1 }}
      ></Typography>
      <button onClick={handleExportToExcel} style={{ backgroundColor: 'darkslateblue', color: 'white', border: 'none', padding: '8px 16px', cursor: 'pointer' }}>Export Users Detail</button>
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

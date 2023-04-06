import React, { useEffect, useState } from "react";
import { Stack, Typography, Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import AddNewDeliverySlot from "../delivery_slot/components/AddNewDeliverySlot";
import DeliverySlotList from "../delivery_slot/components/DeliverySlotList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Autocomplete from "@mui/material/Autocomplete";
import { useAppStore } from "../appStore";
import { db } from "../firebase-config";
import {
    collection,
    getDocs,
} from "firebase/firestore";

function DeliverySlots() {
    const [addNewDeliverySlot, setAddNewDeliverySlot] = useState(false);
    const handleOpen = () => setAddNewDeliverySlot(true);
    const handleClose = () => setAddNewDeliverySlot(false);
    const [options, setOptions] = useState([]);
    const rows = useAppStore((state) => state.rows);
    const setRows = useAppStore((state) => state.setRows);
    const deliverySlotCollectionRef = collection(db, "DeliverySlot");


    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        const data = await getDocs(deliverySlotCollectionRef);
        const uniqueValues = [...new Set(data.docs.flatMap(doc => Object.values(doc.data())))];
        setOptions(uniqueValues);
        setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const filterData = (v) => {
        if (v) {
            const filteredRows = rows.filter(row => Object.values(row).includes(v));
            setRows(filteredRows);
        } else {
            getUsers();
        }
    };


    const actionBar = () => (
        <>
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
                {/* must have some filters */}
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                ></Typography>
                <Button
                    variant="contained"
                    endIcon={<AddCircleIcon />}
                    onClick={handleOpen}
                >
                    Add Delivery Slot
                </Button>
            </Stack>
        </>
    );
    return (
        <>
            <PageTemplate actionBar={actionBar()} title={"Delivery Slots"}>
                <DeliverySlotList />
            </PageTemplate>
            {addNewDeliverySlot && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "#fff",
                        padding: "20px",
                        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                        borderRadius: "5px",
                        border: "1px solid #000",
                        zIndex: "999",
                        overflowY: "scroll",
                        maxHeight: "80vh", // set a maximum height to prevent the pop-up from taking up the entire screen
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button onClick={handleClose}>X</button>
                    </div>
                    <h2 style={{ textAlign: "center" }}>Add Delivery Slot</h2>
                    <AddNewDeliverySlot />
                </div>
            )}
        </>
    );
}

export default DeliverySlots;
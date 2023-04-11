import React, { useEffect, useState } from "react";
import { Stack, Typography, Button, Modal, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import AddNewDeliveryBoy from "../delivery_boy/components/AddNewDeliveryBoy";
import DeliveryBoyList from "../delivery_boy/components/DeliveryBoyList";
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
    const [addNewDeliveryBoy, setAddNewDeliveryBoy] = useState(false);
    const [deliveryBoyModalData, setDeliveryBoyModalData] = useState(null)
    const handleOpen = () => setAddNewDeliveryBoy(true);
    const handleClose = () => setAddNewDeliveryBoy(false);
    const [options, setOptions] = useState([]);
    const rows = useAppStore((state) => state.rows);
    const setRows = useAppStore((state) => state.setRows);
    const deliveryBoyCollectionRef = collection(db, "DeliveryBoy");


    useEffect(() => {
        getBoys();
    }, []);

    const getBoys = async () => {
        const data = await getDocs(deliveryBoyCollectionRef);
        const uniqueValues = [...new Set(data.docs.flatMap(doc => Object.values(doc.data())))];
        setOptions(uniqueValues);
        setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const filterData = (v) => {
        if (v) {
            const filteredRows = rows.filter(row => Object.values(row).includes(v));
            setRows(filteredRows);
        } else {
            getBoys();
        }
    };

    const modal = () => (
        <Modal onClose={() => setDeliveryBoyModalData(false)} open={addNewDeliveryBoy}>
          <Box sx={{ width: '50%', margin: '0 auto', top: '50%' }}>
            <AddNewDeliveryBoy closeModal={()=>setDeliveryBoyModalData(false)} data={deliveryBoyModalData} />
          </Box>
        </Modal>
      );


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
                        <TextField {...params} size="small" label="Search Boy" />
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
                    Add Delivery Boy
                </Button>
            </Stack>
        </>
    );
    return (
        <>
            <PageTemplate modal={modal()} actionBar={actionBar()} title={"Delivery Boys"}>
                <DeliveryBoyList openModal={(row)=> {setDeliveryBoyModalData(row)
                handleOpen()}}/>
            </PageTemplate>
        </>
    );
}

export default DeliverySlots;
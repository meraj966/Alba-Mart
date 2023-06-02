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
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

function DeliveryBoys() {
    const [addNewDeliveryBoy, setAddNewDeliveryBoy] = useState(false);
    const [deliveryBoyModalData, setDeliveryBoyModalData] = useState(null)
    const [openInEditMode, setOpenInEditMode] = useState(false);
    const handleOpen = () => setAddNewDeliveryBoy(true);
    const handleClose = () => setAddNewDeliveryBoy(false);
    const [deliveryboyData, setDeliveryBoyData] = useState([]);
    const deliveryBoyCollectionRef = collection(db, "DeliveryBoy");

    useEffect(() => {
        getBoys();
    }, []);

    const getBoys = async () => {
        const data = await getDocs(deliveryBoyCollectionRef);
        setDeliveryBoyData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(deliveryBoyCollectionRef, id));
        setDeliveryBoyData(deliveryboyData.filter((row) => row.id !== id));
    };

    const modal = () => (
        <Modal onClose={() => setAddNewDeliveryBoy(false)} open={addNewDeliveryBoy}>
            <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
                <AddNewDeliveryBoy
                    closeModal={() => setAddNewDeliveryBoy(false)}
                    isEditMode={openInEditMode}
                    data={deliveryBoyModalData}
                    refreshDeliveryBoys={getBoys}
                    handleClose={handleClose}
                />
            </Box>
        </Modal>
    );

    const actionBar = () => (
        <>
            <Stack direction="row" spacing={2} className="my-2 mb-2">
                <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                ></Typography>
                <Button
                    variant="contained"
                    endIcon={<AddCircleIcon />}
                    onClick={() => {
                        handleOpen();
                        setOpenInEditMode(false);
                    }}
                >
                    Add Delivery Boy
                </Button>
            </Stack>
        </>
    );
    return (
        <>
            <PageTemplate
                modal={modal()}
                actionBar={actionBar()}
                title={"Delivery Boys List"}
            >
                <DeliveryBoyList
                    openModal={(row) => {
                        setOpenInEditMode(true);
                        setDeliveryBoyModalData(row);
                        handleOpen();
                    }}
                    deliveryboyData={deliveryboyData}
                    handleDelete={handleDelete}
                />
            </PageTemplate>

        </>
    );
}

export default DeliveryBoys;
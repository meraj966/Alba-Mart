import React, { useEffect, useState } from "react";
import { Stack, Typography, Button, Modal, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import AddNewDeliveryCharge from "../delivery_charge/components/AddNewDeliveryCharge";
import DeliveryChargeList from "../delivery_charge/components/DeliveryChargeList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Autocomplete from "@mui/material/Autocomplete";
import { useAppStore } from "../appStore";
import { db } from "../firebase-config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

function DeliveryBoys() {
    const [addNewDeliveryCharge, setAddNewDeliveryCharge] = useState(false);
    const [deliveryChargeModalData, setDeliveryChargeModalData] = useState(null)
    const [openInEditMode, setOpenInEditMode] = useState(false);
    const handleOpen = () => setAddNewDeliveryCharge(true);
    const handleClose = () => setAddNewDeliveryCharge(false);
    const [deliveryChargeData, setDeliveryChargeData] = useState([]);
    const deliveryChargeCollectionRef = collection(db, "DeliveryCharge");

    useEffect(() => {
        getBoys();
    }, []);

    const getBoys = async () => {
        const data = await getDocs(deliveryChargeCollectionRef);
        setDeliveryChargeData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

    };

    const handleDelete = async (id) => {
        await deleteDoc(doc(deliveryChargeCollectionRef, id));
        setDeliveryChargeData(deliveryChargeData.filter((row) => row.id !== id));
    };

    const modal = () => (
        <Modal onClose={() => setAddNewDeliveryCharge(false)} open={addNewDeliveryCharge}>
            <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
                <AddNewDeliveryCharge
                    closeModal={() => setAddNewDeliveryCharge(false)}
                    isEditMode={openInEditMode}
                    data={deliveryChargeModalData}
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
                    Add Delivery Charges
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
                <DeliveryChargeList
                    openModal={(row) => {
                        setOpenInEditMode(true);
                        setDeliveryChargeModalData(row);
                        handleOpen();
                    }}
                    deliveryChargeData={deliveryChargeData}
                    handleDelete={handleDelete}
                />
            </PageTemplate>

        </>
    );
}

export default DeliveryBoys;
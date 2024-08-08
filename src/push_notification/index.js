import React, { useContext, useEffect, useState } from "react";
import { Stack, Typography, Button, Modal, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import AddMessage from "../push_notification/components/AddMessage";
import MessageList from "../push_notification/components/MessageList";
import DeliveryBoyList from "../delivery_boy/components/DeliveryBoyList";
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Autocomplete from "@mui/material/Autocomplete";
import { useAppStore } from "../appStore";
import { db } from "../firebase-config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { AppContext } from "../context";
import {
  CONTROL_ADD_NOTIFICATIONS,
  userHasAccessToKey,
} from "../authentication/utils";

function PushNotification() {
  const { userInfo } = useContext(AppContext);
  const [addNewMessage, setAddNewMessage] = useState(false);
  const [messageModalData, setMessageModalData] = useState(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);
  const handleOpen = () => setAddNewMessage(true);
  const handleClose = () => setAddNewMessage(false);
  const [messageData, setMessageData] = useState([]);
  const notificationCollectionRef = collection(db, "GlobalNotification");

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    const data = await getDocs(notificationCollectionRef);
    setMessageData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(notificationCollectionRef, id));
    setMessageData(messageData.filter((row) => row.id !== id));
  };

  const modal = () => (
    <Modal onClose={() => setAddNewMessage(false)} open={addNewMessage}>
      <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
        <AddMessage
          closeModal={() => setAddNewMessage(false)}
          isEditMode={openInEditMode}
          data={messageModalData}
          refreshMessages={getNotifications}
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
        {userHasAccessToKey(userInfo, CONTROL_ADD_NOTIFICATIONS) ? (
          <Button
            variant="contained"
            endIcon={<AddCircleIcon />}
            onClick={() => {
              handleOpen();
              setOpenInEditMode(false);
            }}
          >
            Add Notifications
          </Button>
        ) : null}
      </Stack>
    </>
  );
  return (
    <>
      <PageTemplate
        modal={modal()}
        actionBar={actionBar()}
        title={"Notifications Lists"}
      >
        <MessageList
          openModal={(row) => {
            setOpenInEditMode(true);
            setMessageModalData(row);
            handleOpen();
          }}
          messageData={messageData}
          handleDelete={handleDelete}
        />
      </PageTemplate>
    </>
  );
}

export default PushNotification;

import React from "react";
import { Modal, Box, Card, CardHeader, CardContent } from "@mui/material";
function ModalPopup({ children, onClose, open, title }) {
  return (
    <Modal onClose={onClose} open={open}>
      <Box sx={{ width: "80%", margin: "0 auto", marginTop: '10%' }}>
        <Card sx={{ marginTop: "25px", border: "1px solid" }}>
          <CardHeader title={title} />
          <CardContent>{children}</CardContent>
        </Card>
      </Box>
    </Modal>
  );
}

export default ModalPopup;

import React from "react";
import Alert from "@mui/material/Alert";
import PageTemplate from "../../pages/reusable/PageTemplate";

function AccessDenied() {
  return (
    <PageTemplate title="Access Denied">
      <Alert severity="info" style={{ margin: "10px" }}>
        You do not have access to view this page. Please contact administrator
        at <i>albamart786@gmail.com or +917903423922</i> to know more.
      </Alert>
    </PageTemplate>
  );
}

export default AccessDenied;

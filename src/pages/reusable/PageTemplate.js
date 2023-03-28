import { Box, Divider, Paper, Typography } from "@mui/material";
import React from "react";
import Navbar from "../../components/Navbar";
import Sidenav from "../../components/Sidenav";

function PageTemplate(props) {
  return (
    <div className="bgcolor">
      <Navbar />
      <Box height={70} />
      <Box sx={{ display: "flex" }}>
        <Sidenav />
        <Box component={"main"} sx={{ flexGrow: 1, p: 3 }}>
          <>
            {props.modal}
            <Paper sx={{ width: "98%", overflow: "hidden", padding: "12px" }}>
              <Typography gutterBottom variant="h5" sx={{ padding: "20px", fontWeight: 550 }}>
                {props.title}
              </Typography>
              <Divider />
              <Box height={10} />
              {props.actionBar}
              {props.children}
            </Paper>
          </>
        </Box>
      </Box>
    </div>
  );
}

export default PageTemplate;

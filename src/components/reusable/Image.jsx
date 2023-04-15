import { Box } from "@mui/system";
import React from "react";

function Image({ url, alt }) {
  return (
    <Box
      component="img"
      sx={{
        height: 233,
        width: 350,
        maxHeight: { xs: 233, md: 167 },
        maxWidth: { xs: 350, md: 250 },
      }}
      alt={alt}
      src={url}
    />
  );
}

export default Image;

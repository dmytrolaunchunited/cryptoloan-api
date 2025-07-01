import { FC, memo } from "react";
import { Box, Typography } from "@mui/material";

export const AdminEmpty: FC = memo(() => {
  return (
     <Box bgcolor="background.default" color="text.primary" sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}>
        <Box>
          <Typography variant="body1" color="secondary">
            Nothing to display
          </Typography>
          <Typography variant="caption" color="secondary">
            This list is currently empty. Please check back later or add new entries.
          </Typography>
        </Box>
      </Box>
  );
});
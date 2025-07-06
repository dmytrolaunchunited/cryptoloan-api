import { FC, memo } from "react";
import { Box, Typography } from "@mui/material";
import { CreateButton, } from "react-admin";

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
          <Typography variant="button" color="secondary" component="div">
            Nothing to display
          </Typography>
          <Typography variant="caption" color="secondary">
            This list is currently empty. Please check back later or add new entries.
          </Typography>
          <Box sx={{
            textAlign: "center"
          }}>
            <CreateButton icon={null} sx={{
              '&.MuiButtonBase-root': {
                padding: 1,
                marginTop: 1,
                borderRadius: 18,
                paddingX: 2,
              }
            }} />
          </Box>
        </Box>
      </Box>
  );
});
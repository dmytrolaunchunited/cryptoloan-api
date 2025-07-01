import { FC, memo } from "react";
import { Box, Typography } from "@mui/material";

export const AdminCatchAll: FC = memo(() => {
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
            Sorry we couldn't find that page
          </Typography>
          <Typography variant="caption" color="secondary">
            Maybe the page you are looking for has been removed, or you typed in the wrong URL
          </Typography>
        </Box>
      </Box>
  );
});
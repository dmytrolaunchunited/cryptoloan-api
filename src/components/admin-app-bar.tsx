import { FC, memo } from 'react';
import { AppBar } from 'react-admin';
import { Typography, Box } from '@mui/material';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const AdminAppBar: FC = memo((props) => (
  <AppBar {...props}>
    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
      <Box>
        <Typography variant="body1" sx={{
          fontWeight: 100,
          fontSize: 14,
        }}>CryptoLoan</Typography>
        <Typography
          sx={{
            fontSize: 12,
            lineHeight: 0.7,
          }}
          variant="body2"
          color="secondary"
        >Admin {publicRuntimeConfig.version}</Typography>
      </Box>
    </Box>
  </AppBar>
));
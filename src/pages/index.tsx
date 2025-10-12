import { memo } from "react";
import { Box, createTheme, CssBaseline, ThemeProvider, Typography } from '@mui/material';
import getConfig from "next/config";
import { usePalette } from "../hooks/palette";

const { publicRuntimeConfig } = getConfig();

export default memo(() => {
  const palette = usePalette();
  const theme = createTheme({ palette });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        backgroundImage: 'radial-gradient(circle at 50% 14em, #333333 0%, #222222 60%, #000000 100%)',
      }}>
        <Box sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Box sx={{
            flexDirection: "column",
          }}>
            <Box sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "baseline",
            }}>
              <Typography variant="h1" sx={{
                fontWeight: 100,
                fontSize: 32,
              }}>CryptoLoan</Typography>
              <Typography variant="caption" color="primary" sx={{
                fontWeight: 100,
                marginLeft: 0.5,
              }}>beta {publicRuntimeConfig.version}</Typography>
            </Box>
            <Typography variant="subtitle1" color="secondary" sx={{
              fontWeight: 100,
              lineHeight: 1,
            }}>Instant crypto loans, fair terms.</Typography>
          </Box>
        </Box>
        <Box sx={{
          padding: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Typography color="primary" variant="caption">
            © {new Date().getFullYear()} CryptoLoan
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
});

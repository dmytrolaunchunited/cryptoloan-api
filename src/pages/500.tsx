import { memo } from "react";
import { Box, createTheme, CssBaseline, Link, ThemeProvider, Typography } from '@mui/material';
import { usePalette } from "../hooks/palette";

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
            maxWidth: "600px",
          }}>
            <Typography
              variant="h1"
              color="secondary"
              sx={{
                fontSize: "3rem",
              }}
            >500</Typography>
            <Typography
              variant="body1"
              color="primary"
              sx={{
                fontSize: "1.25rem",
              }}
            >We're aware of the issue and actively working to resolve it as quickly as possible.</Typography>
            <Typography
              variant="caption"
              color="primary"
            >Please try again later, or navigate back
              <Link
                underline="none"
                color="secondary"
                href="/"
                sx={{
                  marginLeft: 1,
                  marginRight: 1,
                }}
              >
                Back
              </Link>
            </Typography>
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

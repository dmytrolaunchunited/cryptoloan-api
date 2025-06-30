import { FC, memo } from 'react';
import { Box, Button, TextField, Tooltip, Typography } from '@mui/material';
import { Login } from 'react-admin';

export const AdminLoginPage: FC = memo(() => {
  return (
    <Login avatarIcon={<></>} sx={{
      '& .RaLogin-avatar': {
        display: 'none',
      },
      '& .RaLogin-card': {
        margin: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
      },
      backgroundImage: 'radial-gradient(circle at 50% 14em, #333333 0%, #222222 60%, #000000 100%)',
    }}>
      <Box sx={{
        paddingX: 2.5,
        paddingY: 2,
       
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Box sx={{
          width: 320,
          display: "flex",
          alignItems: "baseline",
        }}>
          <Typography variant="h1" sx={{
            fontWeight: 100,
            fontSize: 18,
          }}>CryptoLoan</Typography>
          <Typography variant="caption" color="primary" sx={{
            fontWeight: 100,
            marginLeft: 0.5,
            fontSize: 10,
          }}>Admin</Typography>
        </Box>
        
        <Box sx={{
          display: "flex",
          marginTop: 3,
          flexDirection: 'column',
        }}>
          <Typography variant="h1" sx={{
            fontWeight: 100,
            fontSize: 32,
          }}>Login</Typography>
          <Typography variant="caption" sx={{
            fontWeight: 100,
            fontSize: 14,
            lineHeight: 1,
          }}>Let's manage things</Typography>

          <TextField
            sx={{
              marginTop: 3,
            }}
            fullWidth
            // error={!!props.errors.email && !!props.touched.email}
            // value={props.values.email}
            // onChange={props.handleChange}
            // onBlur={props.handleBlur}
            // helperText={props.touched.email && props.errors.email}
            margin="normal"
            variant="outlined"
            label="Secret Key"
            size="small"
            name="secretKey"
          />
        </Box>
        <Box sx={{
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
                        marginTop: 1,
        }}>
          <Tooltip arrow title="Connect with Administrator">
            <Button
              sx={{
                textTransform: "none",
                borderRadius: 14,
                marginRight: 1,
                paddingX: 3,
              }}
              color="secondary"
              href="mailto: ross@launchunited.io"
            >Forget Your API key?</Button>
          </Tooltip>
          <Button
            sx={{
              textTransform: "none",
              maxWidth: 100,
              borderRadius: 14,
              paddingX: 3,
            }}
            loading={false}
            disabled={false}
            variant="outlined"
            type="submit"
            color="primary"
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Login>
  );
});

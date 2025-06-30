import { ChangeEvent, FC, memo, useCallback, useState } from 'react';
import { Box, Button, TextField, Tooltip, Typography } from '@mui/material';
import { Login, useLogin, useNotify, useRedirect } from 'react-admin';

export const AdminLoginPage: FC = memo(() => {
  const [loading, setLoading] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const login = useLogin();
  const notify = useNotify();
  const redirect = useRedirect()

  const onClickSubmit = useCallback(async () => {
    setLoading(true);
    if (!secretKey) {
      const type = 'warning';
      notify('Invalid secret key. Please check and try again.', { type });
      setLoading(false);
      return;
    }
    

    const data = await fetch('/api/admin/auth', {
      method: "POST",
      body: JSON.stringify({ secretKey }),
    });

    if (!data.ok) {
      console.error('[ADMIN][AdminLoginPage][onClickSubmit]', data.statusText);
      const type = 'error';
      notify('Oops… Something went wrong.', { type });
      setLoading(false);
      return;
    }

    localStorage.setItem('secretKey', secretKey);
    redirect('/');

    const type = 'info';
    notify('Login successful. Welcome!', { type });
    setLoading(false);
  }, [login, setLoading, secretKey, notify, redirect]);

  const onChangeSecretKey = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSecretKey(event.target.value);
  }, [setSecretKey]);

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
            value={secretKey}
            onChange={onChangeSecretKey}
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
            onClick={onClickSubmit}
            loading={loading}
            disabled={loading}
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

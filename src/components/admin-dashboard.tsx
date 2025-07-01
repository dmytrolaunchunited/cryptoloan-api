import { Close, TipsAndUpdates } from '@mui/icons-material';
import { Avatar, Card, CardHeader, Grid, IconButton } from '@mui/material';
import { FC, memo } from 'react';
import { useStore } from 'react-admin';
import { AdminDashboardUsers } from './admin-dashboard-users';

export const AdminDashboard: FC = memo(() => {
  const [display, setDisplay] = useStore('welcome', true);

  const onClick = () => {
    setDisplay(!display);
  }
  return (
    <>
      <Grid container spacing={1}>
        {display && (
          <Grid size={12}>
            <Card sx={{
              marginTop: 1,
            }}>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'rgb(255,	235,	59, 0.5)'}}>
                    <TipsAndUpdates />
                  </Avatar>
                }
                action={
                  <IconButton onClick={onClick} size="small" color="secondary" sx={{
                    marginTop: -1.5,
                  }}>
                    <Close fontSize="small" sx={{
                      fontSize: 14,
                    }} />
                  </IconButton>
                }
                title="Welcome to the administration"
                subheader={`${new Date()}`}
              />
            </Card>
          </Grid>
        )}
        <Grid size={2} sx={{
          ...(!display ? { marginTop: 1 } : {}),
        }}>
          <AdminDashboardUsers />
        </Grid>
      </Grid>
    </>
  );
});
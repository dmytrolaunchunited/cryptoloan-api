import { FC, memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardActionArea, Avatar } from '@mui/material';
import { InstallMobile } from '@mui/icons-material';
import { useDataProvider } from 'react-admin';

export const AdminDashboardUserDevices: FC = memo(() => {
  const [total, setTotal] = useState<any>();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider.getList('user-devices', {}).then(({ total }) => {
      setTotal(total);
    });
  }, [dataProvider, setTotal]);

  return (
    <Card>
      <CardActionArea component={Link} to="/user-devices">
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'rbg(129, 199, 132, 0.5)' }}>
              <InstallMobile sx={{ fontSize: 21 }}/>
            </Avatar>
          }
          title={total}
          subheader={'Devices'}
        />
      </CardActionArea>
    </Card>
  );
});
import { FC, memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardActionArea, Avatar } from '@mui/material';
import { SupervisorAccount } from '@mui/icons-material';
import { useDataProvider } from 'react-admin';

export const AdminDashboardUsers: FC = memo(() => {
  const [total, setTotal] = useState<any>();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider.getList('users', {}).then(({ total }) => {
      setTotal(total);
    });
  }, [dataProvider, setTotal]);

  return (
    <Card>
      <CardActionArea component={Link} to="/users">
        <CardHeader
          avatar={<Avatar sx={{ bgcolor: 'rbg(129, 199, 132, 0.5)' }}><SupervisorAccount /></Avatar>}
          title={total}
          subheader={'Users'}
        />
      </CardActionArea>
    </Card>
  );
});
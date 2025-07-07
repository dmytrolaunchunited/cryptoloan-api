import { FC, memo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardActionArea, Avatar } from '@mui/material';
import { AppShortcut } from '@mui/icons-material';
import { useDataProvider } from 'react-admin';

export const AdminDashboardApplications: FC = memo(() => {
  const [total, setTotal] = useState<any>();
  const dataProvider = useDataProvider();

  useEffect(() => {
    dataProvider.getList('applications', {}).then(({ total }) => {
      setTotal(total);
    });
  }, [dataProvider, setTotal]);

  return (
    <Card>
      <CardActionArea component={Link} to="/applications">
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'rbg(129, 199, 132, 0.5)' }}>
              <AppShortcut sx={{ fontSize: 21 }}/>
            </Avatar>
          }
          title={total}
          subheader={'Applications'}
        />
      </CardActionArea>
    </Card>
  );
});
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
} from '@mui/material';
import { GetServerSideProps } from 'next/types';
import { useFetchUser } from '@app/lib/authContext';
import Layout from '@app/components/layout';
import { IProduct } from '@app/types';

const baseUrl = 'http://localhost:1337';
interface Order {
  id: number;
  attributes: {
    products: {
        data: IProduct []
    }
    Amount: number;
    Email: string;
    owner: number;
    Status: string;
  };
  // Add more fields as needed
}
interface MyOrdersProps {
  orders: Order[];
}

const MyOrders = ({ orders }: MyOrdersProps) => {
  const { user, loading } = useFetchUser();
  return (
    <Layout user={user} loading={loading}>
      <Container maxWidth="sm" sx={{my:4}}>
        <Typography variant="h4" align="center" gutterBottom>
          My Orders
        </Typography>
        {loading ? (
          <Typography variant="body1" align="center">
            Loading orders...
          </Typography>
        ) : (
          <List>
            {orders.map((order) => (
              <div key={order.id}>
                <Divider />
                <ListItem
                  sx={{ display: 'flex' }} key={order.id}>
                  <ListItemText
                    primary={`Order ID: ${order.id}`}
                    secondary={`Amount: Rs ${order.attributes.Amount}`} />
                </ListItem>
                <Divider textAlign='left' light>
                  <Typography> {order.attributes.Status} </Typography>
                </Divider>
                <Grid container my={2}>
                  {order.attributes.products.data.map((item) => (
                    <Grid key={item.id} item xs={4} lg={4}>
                      <img
                        src={item.attributes.Images?.data[0]?.attributes?.url}
                        alt={item.attributes.Images?.data[0]?.attributes
                          ?.alternativeText ?? ''}
                        width="50"
                        height="40" />
                      <Typography> {item.attributes.Title} </Typography>
                      <Typography> Price: Rs {item.attributes.Price} </Typography>
                    </Grid>
                  ))}
                </Grid>
              </div>
            ))}
          </List>
        )}
      </Container>
    </Layout>
  );
};

export default MyOrders;

export const getServerSideProps: GetServerSideProps<any> = async (context) => {
  const jwt = context.req.cookies['jwt'];
  let data = { data: [] };
  if (jwt) {
    const res = await fetch(
      `${baseUrl}/api/orders?populate[products][populate][0]=Images`,
      {
        cache: 'no-store',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    );
    data = await res.json();
    console.log('data fetched = ', data.data?.length);
  }
  return {
    props: {
      orders: data?.data ?? {},
    },
  };
};

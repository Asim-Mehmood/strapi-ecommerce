import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useFetchUser } from '../lib/authContext';
import Layout from '@app/components/layout';
import type { GetServerSideProps } from 'next';
import Link from 'next/link';
import { IPagination, IProduct} from '@app/types';
import { CartProvider } from './cart/CartContext';
import { CartButton } from '@app/components/cartButton';


const baseUrl = 'http://localhost:1337';

const theme = createTheme();

interface IHomeProps {
  products: IProduct[];
  pagination: IPagination;
}


export default function Home({ products }: IHomeProps) {
  console.log(products);
  const { user, loading } = useFetchUser();
  
  return (
    <Layout user={user} loading={loading}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          <Box
            sx={{
              bgcolor: 'lightgrey',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
              height: 400,
              width: '100h',
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                pt={10}
              >
                Featured Products
              </Typography>
              <Stack
                sx={{ pt: 4 }}
                direction="row"
                spacing={2}
                justifyContent="center"
              >
              </Stack>
            </Container>
          </Box>
          <Container sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
              {products.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: 'lg',
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        pt: '16.25%',
                        minHeight: 400,
                        minWidth: '100%'
                      }}
                      image={
                        product.attributes.Images?.data[0]?.attributes?.url
                      }
                      alt={
                        product.attributes.Images?.data[0]?.attributes
                          ?.alternativeText ?? ''
                      }
                    />
                    <CardContent sx={{ pt: '16%', flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {product.attributes.Title}
                      </Typography>
                      <Typography>{product.attributes.Description}</Typography>
                      <Typography sx={{fontWeight:'bold'}} >Rs {product.attributes.Price}</Typography>
                    </CardContent>
                    <CardActions>
                      <Link
                        href={{
                          pathname: `/product/${product.id}`,
                        }}
                      >
                        <Button variant='outlined' sx={{mx:1}}>View
                        </Button>
                      </Link>
                      <CartProvider>
                        <CartButton product={product} />
                      </CartProvider>
                    </CardActions>
                    
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
      </ThemeProvider>
    </Layout>
  );
}


export const getServerSideProps: GetServerSideProps<any> = async () => {
  {
    /*const productId = parseInt(context.params?.id as string) || 1;*/
  }
  const res = await fetch(`${baseUrl}/api/products?filters[Featured][$eq]=True&populate=*`);
  const data = await res.json();
  return { props: { products: data?.data ?? [], pagination: data?.meta?.pagination ?? {} } };
};

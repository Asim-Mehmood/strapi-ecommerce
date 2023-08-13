import * as React from 'react';
import { useState } from 'react';
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
import { IPagination, IProduct, ICategory } from '@app/types';
import { CartButton } from '@app/components/cartButton';

const baseUrl = 'http://localhost:1337';

const theme = createTheme();

interface IHomeProps {
  products: IProduct[];
  categories: ICategory[];
  pagination: IPagination;
}

export default function Home({ products, categories }: IHomeProps) {
  // console.log(products);
  // console.log(categories);
  const { user, loading } = useFetchUser();
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null,
  );

  const handleCategoryClick = (category: ICategory) => {
    setSelectedCategory(category);
  };

  const filteredProducts = selectedCategory
    ? products.filter(
      (product) =>
        product.attributes.category.data.id === selectedCategory.id,
    )
    : products;

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
              width: '100%',
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                pt={15}
              >
                All Products
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
            <Typography variant="h3" align="center">Categories</Typography>
            <Grid container spacing={2} sx={{mt:2, mb:6}} justifyContent="center">
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleCategoryClick(null)}
                >
                    All
                </Button>
              </Grid>
              {categories.map((category) => (
                <Grid item key={category.id}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.attributes.Name}
                  </Button>
                </Grid>
              ))}
            </Grid>
            <Grid container spacing={4}>
              {filteredProducts.map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        16:9,
                        pt: '16.25%',
                        minHeight: 400,
                        minWidth: 100
                      }}
                      image={
                        product.attributes.Images?.data[0]?.attributes?.url
                      }
                      alt={
                        product.attributes.Images?.data[0]?.attributes
                          ?.alternativeText ?? ''
                      }
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
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
                        <Button variant='outlined' sx={{mx:1}}>
                        View
                        </Button>
                      </Link>
                      <CartButton product={product} />
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
  const [productRes, categoryRes] = await Promise.all([
    fetch(`${baseUrl}/api/products?populate=*`),
    fetch(`${baseUrl}/api/categories`),
  ]);
  const [productData, categoryData] = await Promise.all([
    productRes.json(),
    categoryRes.json(),
  ]);
  return {
    props: {
      products: productData?.data ?? [],
      categories: categoryData?.data ?? [],
      pagination: productData?.meta?.pagination ?? {},
    },
  };
};

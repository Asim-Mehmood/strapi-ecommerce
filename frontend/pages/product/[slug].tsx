import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Container, Typography, TextField } from '@mui/material';
import Layout from '@app/components/layout';
import { useState } from 'react';
import { useFetchUser } from '../../lib/authContext';

const baseUrl = 'http://localhost:1337';

function productdetail({ product }) {
  const { user, loading } = useFetchUser();
  console.log(product);
  const [quantity, setQuantity] = useState(1);
  const handleQuantityChange = (event) => {
    setQuantity(parseInt(event.target.value));
  };
  
  return (
    <Layout user={user} loading={loading}>
      <Container sx={{marginTop:10}}>
        <Card sx={{ display: 'flex', alignItems: 'center' }}>
          <CardMedia
            component="img"
            sx={{ width: 300, objectFit: 'cover' }}
            image={product.attributes.Images?.data[0]?.attributes?.url}
            alt={product.attributes.Images?.data[0]?.attributes?.alternativeText ?? ''}
          />
          <CardContent>
            <Typography variant="h3">{product.attributes.Title}</Typography>
            <Typography variant="body2">{product.attributes.Description}</Typography>
            <Typography variant="body1" sx={{fontWeight:'bold'}}>Price: RS {product.attributes.Price}</Typography>
            <TextField
              sx={{margin:2}}
              label="Quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{ min: 1, max: product.attributes.Quantity }} // Set a minimum value of 1 for quantity
            />
            <Button variant="contained" color="primary" sx={{margin:3}}>
            Add to Cart
            </Button>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
}

export default productdetail;

export async function getServerSideProps(context: { query: { slug: any; }; }) {
  const { slug } = context.query;

  const res = await fetch(
    `${baseUrl}/api/products/${slug}?populate=*`,
  );
  const data = await res.json();
  return {
    props: {
      product: data?.data ?? {},
    },
  };
}

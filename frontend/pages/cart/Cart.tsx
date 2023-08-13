import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
} from '@mui/material';
import { useCart } from './CartContext';
import Layout from '@app/components/layout';
import { useFetchUser } from '../../lib/authContext';
import { useMemo } from 'react';
import { fetcher } from '@app/lib/api';
import Router from 'next/router';
import { getTokenFromLocalCookie } from '@app/lib/auth';

const CartItems = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, removeAll } = useCart();
  console.log(cartItems);
  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + item.attributes.Quantity * item.attributes.Price,
        0,
      ),
    [cartItems],
  );
  const jwt = getTokenFromLocalCookie();
  const createOrder = async () => {
    if (!jwt){
      Router.push('/login');
      return;
    }
    try {
      const response = await fetcher(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/orders`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            Amount: totalPrice,
            products: cartItems.map(c => c.id),
          }),
        },
      );
      if (response?.order) {
        console.log(response?.order);
        removeAll();
        Router.push(`/order/${response.order.id}`);
      }
      if (response?.error?.details?.errors?.length) {
        const fieldsErrObj: any = {};
        response?.error?.details?.errors.forEach((errObj: any) => {
          fieldsErrObj[(errObj.path?.[0] as string) || ''] = errObj.message;
        });
        /*  setFieldErrors(fieldsErrObj);
      } else if (response?.error) {
        setError(response?.error?.message || 'Something went wrong');
      } */
      } 
    }
    catch (error) {
    // Handle error
      console.error('Error creating order:', error);
      return null;
    }
  };

  const handleRemoveFromCart = (productId: number) => {
    removeFromCart(productId);
  };

  return (
    <Container>
      {cartItems.length === 0 ? (
        <Typography variant="h5" mt={10}>Your cart is empty</Typography>
      ) : (
        <>
          <Typography variant="h5" mt={10}>Your Cart</Typography>
          <List>
            {cartItems.map((product) => (
              <ListItem key={product.id}>
                <img
                  src={product.attributes.Images?.data[0]?.attributes?.url}
                  alt={
                    product.attributes.Images?.data[0]?.attributes
                      ?.alternativeText ?? ''
                  }
                  width="150"
                  height="120"
                />
                <ListItemText
                  sx={{ px: 2 }}
                  primary={product.attributes.Title}
                  secondary={`Price: Rs${product.attributes.Price}`}
                />
                <TextField
                  sx={{mr:2}}
                  label="Quantity"
                  type="number"
                  value={product.attributes.Quantity}
                  onChange={(event) => {
                    updateCartItemQuantity(
                      product.id,
                      Number(event.target.value),
                    );
                  }}
                  inputProps={{ min: 1 }} // Set a minimum value of 1 for quantity
                />
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleRemoveFromCart(product.id)}
                >
                  Remove
                </Button>
              </ListItem>
            ))}
          </List>
          <h2>Total: Rs {totalPrice}</h2>
          <Button variant='contained' onClick={createOrder}>Checkout</Button>
        </>
      )}
    </Container>
  );
};

const Cart = () => {
  const { user, loading } = useFetchUser();
  return (
    <Layout user={user} loading={loading}>
      <CartItems />
    </Layout>
  );
};

export default Cart;

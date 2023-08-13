import { Elements } from '@stripe/react-stripe-js';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { Button, CircularProgress, Container, Grid, ListItem, ListItemText, Typography } from '@mui/material';
import { useFetchUser } from '@app/lib/authContext';
import Layout from '@app/components/layout';

const baseUrl = 'http://localhost:1337';

function CheckoutForm({orderId}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `http://localhost:3000/order/${orderId}`,
        // payment_intent=pi_3Nc9uIFJD5xcEN6q1qpw2kKZ&payment_intent_client_secret=pi_3Nc9uIFJD5xcEN6q1qpw2kKZ_secret_0M9AlLeZiFpGjfGn9TTdqJbTt&redirect_status=succeeded
      },
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      console.log(result.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <Grid item component={'form'} onSubmit={handleSubmit}>
      <PaymentElement />
      <h3>Shipping</h3>
      <AddressElement
        options={{ mode: 'shipping', allowedCountries: ['PAK'] }}
      />
      <Button
        type="submit"
        variant="outlined"
        sx={{ my: 2 }} 
        disabled={!stripe}>
          Submit
      </Button>
    </Grid>
  );
}

function orderDetail({ order }) {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const { user, loading } = useFetchUser();
  console.log(order);


  const options = {
    // passing the client secret obtained from the server
    clientSecret: order.client_secret,
  };

  useEffect(() => {
    setStripe(loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? ''));
  }, []);

  if (!stripe) {
    return (
      <Layout user={user} loading={loading}>
        <CircularProgress />
      </Layout>
    );
  }
  if(order.attributes?.Status === 'Pending'){
    return (
      <Layout user={user} loading={loading}>
        <Grid container gap={2} p={2}>
          <Grid item xs={12} md={5}>
            <Typography variant="h5">Order Details</Typography>
            <Grid item xs my={2}>
              {order.attributes.products.data.map((item) => (
                <ListItem sx={{ display: 'flex' }} key={item.id}>
                  <img
                    src={item.attributes.Images?.data[0]?.attributes?.url}
                    alt={
                      item.attributes.Images?.data[0]?.attributes
                        ?.alternativeText ?? ''
                    }
                    width="50"
                    height="40"
                  />
                  <ListItemText
                    sx={{ px: 2 }}
                    primary={item.attributes.Title}
                    secondary={`Price: Rs${item.attributes.Price}`}
                  />
                </ListItem>
              ))}
            </Grid>
            <Typography my={2} variant="body1">Total Amount: Rs {order.attributes.Amount}</Typography>
          </Grid>
          <Grid item xs>
            <Typography mb={2} variant="h5">Payment Details</Typography>
            <Elements stripe={stripe} options={options}>
              <CheckoutForm orderId={order.id}/>
            </Elements>
          </Grid>
        </Grid>
      </Layout>
    );
  }
  return (
    <Layout user={user} loading={loading}>
      <Container maxWidth="sm" sx={{mt:12}}>
        <Typography variant="h4" align="center" gutterBottom>
                      Payment Successful
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
                      Your order has been successfully placed!
        </Typography>
        <Typography variant="body2" align="center">
                      Order ID: {order.id}
        </Typography>
      </Container>
    </Layout>
  );
}

export default orderDetail;

export async function getServerSideProps(context: { query: { slug: any } }) {
  const { slug } = context.query;

  const res = await fetch(`${baseUrl}/api/orders/${slug}?populate[products][populate][0]=Images`);
  const data = await res.json();
  return {
    props: {
      order: data?.data ?? {},
    },
  };
}

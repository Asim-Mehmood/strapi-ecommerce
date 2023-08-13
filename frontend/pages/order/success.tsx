import { Container, Typography } from '@mui/material';

const SuccessPage = ({ orderId }) => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Payment Successful
      </Typography>
      <Typography variant="body1" align="center" gutterBottom>
        Your order has been successfully placed!
      </Typography>
      <Typography variant="body2" align="center">
        Order ID: {orderId}
      </Typography>
    </Container>
  );
};

export default SuccessPage;

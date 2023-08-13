import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useFetchUser } from '../lib/authContext';
import Layout from '@app/components/layout';

export default function About() {
  const { user, loading } = useFetchUser();
  return (
    <Layout user={user} loading={loading}>
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 6,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
          About Us
          </Typography>
          <Typography variant='body1'sx={{margin:2}}>
          Welcome to our Electronics Store, where innovation and technology intertwine to offer you a revolutionary electronics shopping experience. Our journey began with a simple idea – to create a platform that not only provides the latest gadgets but also enhances your connection with technology. We're not just an e-commerce website; we're a community of tech enthusiasts who believe in making your electronics shopping journey seamless, insightful, and exciting.
          </Typography>
          <Typography variant="h6">
          Our Vision: Redefining Electronics Shopping
          </Typography>
          <Typography variant='body1'sx={{margin:2}}>
          At our Electronics Store, we envision a world where accessing and understanding technology is effortless. Our platform is more than just a marketplace; it's a hub where innovation meets inspiration. Whether you're an avid gamer, a DIY enthusiast, or a gadget aficionado, we're here to cater to your every tech need. Our curated collection reflects our commitment to quality, innovation, and user satisfaction.
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
}

import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useFetchUser } from '../lib/authContext';
import Layout from '@app/components/layout';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { user, loading } = useFetchUser();

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    //
  };

  return (
    <Layout user={user} loading={loading}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt:4
        }}
      >
        <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
          <Typography variant="h4" align="center" mb={2}>
          Contact Us
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              type="email"
            />
            <TextField
              fullWidth
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              margin="normal"
              required
              multiline
              rows={4}
            />
            <Button variant="contained" type="submit" sx={{ mt: 2 }}>
            Submit
            </Button>
          </form>
        </Box>
      </Box>
    </Layout>
  );
}
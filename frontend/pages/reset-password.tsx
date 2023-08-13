import * as React from 'react';
import { fetcher } from '@app/lib/api';
import { useRouter } from 'next/router';
import { Card, Grid, CardContent, TextField, Typography, CardActions, Container } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import Layout from '@app/components/layout';
import { useFetchUser } from '@app/lib/authContext';

const resetpassword: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const {code} = router.query;
  const { user, loading } = useFetchUser();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('password') !== data.get('passwordConfirmation')) {
      return;
    }
    try {
      setSubmitting(true);
      const responseData = await fetcher(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/reset-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            password: data.get('password'),
            passwordConfirmation: data.get('passwordConfirmation'),
          }),
        },
      );
      setSubmitting(false);
      if (responseData?.user) {
        router.push('/');
      }
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };

  if (!code){
    return (
      <Typography variant="h5">Try Again</Typography>
    );
  }    

  return ( 
    <Layout user={user} loading={loading}>
      <Container sx={{ py: 10, maxWidth:550 }} maxWidth="xs" component="form" onSubmit={handleSubmit}>
        <Card>
          <CardContent>
            <Typography component="h1" variant="h5">Reset Password</Typography>
            <Grid container sx={{ py: 1 }}>
              <Grid item xs={12} sx={{ pt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="New Password"
                  id="password"
                  name="password"
                  type="password"
                />
              </Grid>
              <Grid item xs={12} sx={{ pt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Confirm Password"
                  id="password"
                  name="passwordConfirmation"
                  type="password"
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end' }}>
            <LoadingButton
              loading={submitting}
              color="primary"
              type="submit"
              fullWidth
              variant="contained"
            >
      Reset Password
            </LoadingButton>
          </CardActions>
        </Card>
      </Container>
    </Layout>
  );
};
export default resetpassword;
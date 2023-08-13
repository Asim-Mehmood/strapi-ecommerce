import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Layout from '@app/components/layout';
import { fetcher } from '@app/lib/api';
import { setToken } from '@app/lib/auth';
import { useUser } from '@app/lib/authContext';
import Link from 'next/link';
import Router from 'next/router';
import { LoadingButton } from '@mui/lab';
import { Alert, Collapse, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function SignIn() {
  const { user, loading } = useUser();
  const [error, setError] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState<any>({});
  const [submitting, setSubmitting] = React.useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      setSubmitting(true);
      const responseData = await fetcher(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: data.get('email'),
            password: data.get('password'),
          }),
        },
      );
      setSubmitting(false);
      if (responseData?.user) {
        console.log(responseData?.user);
        setToken(responseData);
        Router.push('/');
      }
      if (responseData?.error?.details?.errors?.length) {
        const fieldsErrObj: any = {};
        responseData?.error?.details?.errors.forEach((errObj: any) => {
          fieldsErrObj[(errObj.path?.[0] as string) || ''] = errObj.message;
        });
        setFieldErrors(fieldsErrObj);
      } else if (responseData?.error) {
        setError(responseData?.error?.message || 'Something went wrong');
      }
    } catch (error) {
      setSubmitting(false);
      console.error(error);
    }
  };
  const handleFormChange = React.useCallback(
    (e: any) => {
      if (error) {
        setError('');
      }
      setFieldErrors((prev: any) => ({ ...prev, [e.target.name]: '' }));
    },
    [error],
  );

  return (
    <Layout user={user} loading={loading}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onChange={handleFormChange}
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={Boolean(fieldErrors['email'])}
              helperText={fieldErrors['email']}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={fieldErrors['password']}
              helperText={fieldErrors['password']}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Collapse in={Boolean(error)} sx={{ py: 1 }}>
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setError('');
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {error}
              </Alert>
            </Collapse>
            <LoadingButton
              loading={submitting}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Grid container>
              <Grid item xs>
                <Typography component={Link} href="/forgot" variant="body2">
                  Forgot password?
                </Typography>
              </Grid>
              <Grid item>
                <Typography component={Link} href="/register" variant="body2">
                  {'Don\'t have an account? Sign Up'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
}

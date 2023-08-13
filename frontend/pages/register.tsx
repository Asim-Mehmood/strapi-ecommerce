import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Router from 'next/router';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { fetcher } from '@app/lib/api';
import { setToken } from '@app/lib/auth';
import { useFetchUser } from '@app/lib/authContext';
import Layout from '@app/components/layout';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';

const Register = () => {
  const { user, loading } = useFetchUser();
  const [error, setError] = React.useState('');
  const [fieldErrors, setFieldErrors] = React.useState<any>({});
  const [submitting, setSubmitting] = React.useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      setSubmitting(true);
      const responseData = await fetcher(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local/register`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.get('email'),
            password: data.get('password'),
            username: data.get('username'),
            FirstName: data.get('FirstName'),
            LastName: data.get('LastName'),
          }),
          method: 'POST',
        },
      );
      setSubmitting(false);
      console.log(responseData);
      if (responseData?.user) {
        Router.push('/login');
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

  const handleFormChange = React.useCallback((e: any) => {
    if (error) {
      setError('');
    }
    setFieldErrors((prev: any) => ({ ...prev, [e.target.name]: '' }));
  }, [error]);

  return (
    <Layout user={user} loading={loading}>
      <Container maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            onChange={handleFormChange}
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="FirstName"
                  fullWidth
                  id="FirstName"
                  label="First Name"
                  autoFocus
                  error={fieldErrors['FirstName']}
                  helperText={fieldErrors['FirstName']}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="LastName"
                  label="Last Name"
                  name="LastName"
                  autoComplete="family-name"
                  error={fieldErrors['LastName']}
                  helperText={fieldErrors['LastName']}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="User Name"
                  name="username"
                  autoComplete="username"
                  error={fieldErrors['username']}
                  helperText={fieldErrors['username']}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={fieldErrors['email']}
                  helperText={fieldErrors['email']}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  error={fieldErrors['password']}
                  helperText={fieldErrors['password']}
                />
              </Grid>
            </Grid>
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
              Sign Up
            </LoadingButton>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default Register;

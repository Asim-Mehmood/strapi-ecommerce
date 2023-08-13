import * as React from 'react';
import Layout from '@app/components/layout';
import { useFetchUser } from '@app/lib/authContext';
import {
  Card,
  Grid,
  CardContent,
  Button,
  TextField,
  Typography,
  Avatar,
  CardMedia,
  CardActions,
} from '@mui/material';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { useEffect, useState } from 'react';
import { fetcher } from '@app/lib/api';
import { LoadingButton } from '@mui/lab';
import { useRouter } from 'next/router';
import { getTokenFromLocalCookie } from '@app/lib/auth';

const Profile = () => {
  const { user, loading } = useFetchUser();
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const jwt = getTokenFromLocalCookie();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('password') !== data.get('passwordConfirmation')) {
      return;
    }
    try {
      setSubmitting(true);
      const responseData = await fetcher(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            password: data.get('password'),
            currentPassword: data.get('currentPassword'),
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

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user, setFormData]);

  return (
    <Layout user={user} loading={loading}>
      <Grid container gap={2} direction="row" sx={{ width: '100%', my:5, pl:5, }}>
        <Grid direction="column">
          <Grid item xs={12} sm={12} md={8} gap={1}>
            <Card>
              <CardContent>
                <Typography variant="h6">Edit Profile</Typography>
                <Grid container gap={1} sx={{ py: 1, mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="Username"
                      id="username"
                      fullWidth
                      value={user?.username}
                      disabled
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ pt: 1 }}>
                    <TextField
                      label="Email address"
                      id="email-address"
                      fullWidth
                      disabled
                      value={user?.email}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>
                <Grid container sx={{ py: 1 }}>
                  <Grid item xs={12} sm={12} md={6} sx={{ pr: 1 }}>
                    <TextField
                      label="First Name"
                      id="first-name"
                      fullWidth
                      name="FirstName"
                      value={formData?.FirstName || ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>
                    <TextField
                      label="Last Name"
                      id="last-name"
                      fullWidth
                      name="LastName"
                      value={formData?.LastName || ''}
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button variant='contained' color="primary">Update Profile</Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid sx={{ py: 2 }} component="form" onSubmit={handleSubmit}>
            <Card>
              <CardContent>
                <Typography variant="h6">Change Password</Typography>
                <Grid container sx={{ py: 1 }}>
                  <Grid item xs={12} sx={{ pt: 1 }}>
                    <TextField
                      label="Current Password"
                      id="password"
                      fullWidth
                      name="currentPassword"
                      type="password"
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ pt: 1 }}>
                    <TextField
                      label="New Password"
                      id="password"
                      fullWidth
                      name="password"
                      type="password"
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ pt: 1 }}>
                    <TextField
                      label="Confirm Password"
                      id="password"
                      fullWidth
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
                  variant="contained"
                >
                  Update Password
                </LoadingButton>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 15,
            maxWidth: 270,
            minWidth: 270,
            height: 330,
            //display: 'inline-block',
            // backgroundColor: theme => theme.palette.background.card,
          }}
        >
          <CardMedia sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              alt={`${user?.FirstName || ''} ${user?.LastName || ''}`}
              src={user?.avatar}
              sx={{
                width: (theme) => theme.spacing(12),
                height: (theme) => theme.spacing(12),
                margin: (theme) => theme.spacing(2, 2, 0),
              }}
            />
          </CardMedia>
          <CardContent sx={{ pt: 2 }}>
            <Typography
              sx={{ mx: 0.5 }}
              color="textSecondary"
              variant="h6"
              align="center"
            >
              {user?.FirstName} {user?.LastName}
            </Typography>
            <Typography
              sx={{ mx: 0.5 }}
              color="textSecondary"
              variant="subtitle1"
              align="center"
            >
              {user?.username}
            </Typography>
            <Typography
              sx={{ mx: 0.5 }}
              color="textSecondary"
              variant="subtitle1"
              align="center"
            >
              <ContactMailIcon
                sx={{ verticalAlign: 'middle', mr: 0.5 }}
                fontSize="small"
              />
              {user?.email}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Layout>
  );
};

export default Profile;

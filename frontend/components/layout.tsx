import Nav from '@app/components/nav';
import Footer from '@app/components/footer';
import { UserProvider } from '../lib/authContext';
import { Box } from '@mui/material';
import { FC } from 'react';
import useAppBarHeight from '@app/lib/useAppBarHeight';
import { CartProvider } from '@app/pages/cart/CartContext';

const Layout: FC<{ user: any; loading: boolean; children: any }> = ({
  user,
  loading = false,
  children,
}) => {
  const appBarHeight = useAppBarHeight();
  return (
    <UserProvider value={{ user, loading }}>
      <CartProvider>
        <Nav />
        <Box
          component="main"
          sx={{
            pb:3,
            height: `calc(100vh - 10vh - ${appBarHeight}px)`,
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
        <Footer />
      </CartProvider>
    </UserProvider>
  );
};
export default Layout;

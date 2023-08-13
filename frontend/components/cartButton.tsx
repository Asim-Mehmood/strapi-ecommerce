import { useCart } from '@app/pages/cart/CartContext';
import { IProduct } from '@app/types';
import Button from '@mui/material/Button';

export function CartButton({ product }: { product: IProduct }) {
  const { addToCart, cartItems } = useCart();
  return (
    <Button variant='outlined'sx={{ml:2}} onClick={() => addToCart(product)}>
      Add to Cart
    </Button>
  );
}

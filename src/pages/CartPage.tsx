import { Link } from 'react-router-dom';
import { Button, Table } from '@/components/ui';
import { PermissionGate } from '@/components/common/PermissionGate';
import { ROUTES } from '@/constants';
import { useToast } from '@/context';
import {
  clearCart,
  removeFromCart,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from '@/features/cart';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import type { CartItem } from '@/types';
import { formatCurrency } from '@/utils';

export const CartPage = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const { showToast } = useToast();

  const columns = [
    { key: 'name', header: 'Product', render: (row: CartItem) => row.product.name },
    {
      key: 'quantity',
      header: 'Qty',
      render: (row: CartItem) => (
        <input
          type="number"
          min={1}
          value={row.quantity}
          className="input-field"
          style={{ width: 64 }}
          onChange={(e) =>
            dispatch(
              updateQuantity({
                productId: row.product.id,
                quantity: Number(e.target.value),
              }),
            )
          }
        />
      ),
    },
    {
      key: 'price',
      header: 'Price',
      render: (row: CartItem) => formatCurrency(row.product.price * row.quantity),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: CartItem) => (
        <Button
          variant="danger"
          size="sm"
          onClick={() => {
            dispatch(removeFromCart(row.product.id));
            showToast(`Removed ${row.product.name}`, 'info');
          }}
        >
          Remove
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1 className="page-title">Shopping Cart</h1>
      <p className="page-subtitle">Redux cart slice — persisted in localStorage</p>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty</p>
          <Link to={ROUTES.HOME}>
            <Button variant="primary" style={{ marginTop: '1rem' }}>
              Browse products
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <Table columns={columns} data={cartItems} />
          <div className="cart-footer">
            <strong>Total: {formatCurrency(total)}</strong>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button variant="secondary" onClick={() => dispatch(clearCart())}>
                Clear cart
              </Button>
              <PermissionGate permission="cart:checkout">
                <Link to={ROUTES.CHECKOUT}>
                  <Button>Proceed to checkout</Button>
                </Link>
              </PermissionGate>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

import { Link, Navigate } from 'react-router-dom';
import { CheckoutForm } from '@/components/forms/CheckoutForm';
import { ROUTES } from '@/constants';
import { useToast } from '@/context';
import { clearCart, selectCartItems, selectCartTotal } from '@/features/cart';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { invalidateProductCache } from '@/features/products/productsApi';
import { orderApi } from '@/services/orderApi';
import { socketService } from '@/services/socket/socketService';
import type { CheckoutFormValues } from '@/validations/schemas';
import { formatCurrency } from '@/utils';

export const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);
  const { showToast } = useToast();

  if (cartItems.length === 0) {
    return <Navigate to={ROUTES.CART} replace />;
  }

  const handleCheckout = async (values: CheckoutFormValues) => {
    try {
      const { data } = await orderApi.checkout({
        shippingAddress: values.shippingAddress,
        paymentMethod: values.paymentMethod,
        notes: values.notes,
      });
      dispatch(clearCart());
      dispatch(invalidateProductCache);
      socketService.emitLocal('order:update', {
        orderId: data.orderId,
        status: 'pending',
        message: `Your order ${data.orderId} was placed`,
      });
      showToast(data.message, 'success');
    } catch {
      showToast('Checkout failed', 'error');
    }
  };

  return (
    <div>
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">
        React Hook Form + Zod — dynamic card fields when payment is card
      </p>

      <div className="checkout-layout">
        <div className="checkout-summary profile-card">
          <h3>Order summary</h3>
          <ul className="checkout-summary__list">
            {cartItems.map((item) => (
              <li key={item.product.id}>
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>{formatCurrency(item.product.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <strong>Total: {formatCurrency(total)}</strong>
        </div>

        <div className="checkout-form-wrap profile-card">
          <CheckoutForm onSubmit={handleCheckout} />
        </div>
      </div>

      <Link to={ROUTES.CART} style={{ display: 'inline-block', marginTop: '1rem' }}>
        ← Back to cart
      </Link>
    </div>
  );
};

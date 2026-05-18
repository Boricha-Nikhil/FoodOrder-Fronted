import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../src/context/CartContext';
import Cart from '../src/pages/Cart';

vi.mock('../src/context/SocketContext', () => ({
  SocketProvider: ({ children }) => children,
  useSocket: () => ({ orderStatus: null, joinOrder: vi.fn() }),
}));

function CartWithItems() {
  const { addToCart } = useCart();
  return (
    <>
      <button
        data-testid="seed-cart"
        onClick={() =>
          addToCart({ _id: '1', name: 'Pizza', price: 10.0, image: 'http://img.com/p.jpg', quantity: 1 })
        }
      >
        Seed
      </button>
      <Cart />
    </>
  );
}

const renderCart = () =>
  render(
    <BrowserRouter>
      <CartProvider>
        <CartWithItems />
      </CartProvider>
    </BrowserRouter>
  );

describe('Cart Page', () => {
  it('shows empty cart message initially', () => {
    renderCart();
    expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
  });

  it('displays items after adding to cart', async () => {
    const user = userEvent.setup();
    renderCart();
    await user.click(screen.getByTestId('seed-cart'));
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getAllByText('$10.00').length).toBeGreaterThan(0);
  });

  it('shows correct total price', async () => {
    const user = userEvent.setup();
    renderCart();
    await user.click(screen.getByTestId('seed-cart'));
    await user.click(screen.getByTestId('seed-cart'));
    const totals = screen.getAllByText('$20.00');
    expect(totals.length).toBeGreaterThan(0);
  });
});

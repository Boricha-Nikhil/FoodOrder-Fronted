import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider, useCart } from '../src/context/CartContext';
import Checkout from '../src/pages/Checkout';

vi.mock('../src/services/api', () => ({
  createOrder: vi.fn(() =>
    Promise.resolve({ data: { data: { _id: 'order123' } } })
  ),
}));

vi.mock('../src/context/SocketContext', () => ({
  SocketProvider: ({ children }) => children,
  useSocket: () => ({ orderStatus: null, joinOrder: vi.fn() }),
}));

function CheckoutWithItems() {
  const { addToCart } = useCart();
  return (
    <>
      <button
        data-testid="seed-cart"
        onClick={() =>
          addToCart({ _id: '1', name: 'Pizza', price: 10.0, image: 'http://img.com/p.jpg' })
        }
      >
        Seed
      </button>
      <Checkout />
    </>
  );
}

const renderCheckout = () =>
  render(
    <BrowserRouter>
      <CartProvider>
        <CheckoutWithItems />
      </CartProvider>
    </BrowserRouter>
  );

describe('Checkout Page', () => {
  it('validates required fields on submit', async () => {
    const user = userEvent.setup();
    renderCheckout();
    await user.click(screen.getByTestId('seed-cart'));
    await user.click(screen.getByText('Place Order'));
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Address is required')).toBeInTheDocument();
    expect(screen.getByText('Enter a valid 10-digit phone number')).toBeInTheDocument();
  });

  it('validates phone format', async () => {
    const user = userEvent.setup();
    renderCheckout();
    await user.click(screen.getByTestId('seed-cart'));
    await user.type(screen.getByPlaceholderText('John Doe'), 'Test User');
    await user.type(screen.getByPlaceholderText('123 Main St, City'), '123 Street');
    await user.type(screen.getByPlaceholderText('1234567890'), '123');
    await user.click(screen.getByText('Place Order'));
    expect(screen.getByText('Enter a valid 10-digit phone number')).toBeInTheDocument();
  });
});

import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { SocketProvider } from './context/SocketContext';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderTracking from './pages/OrderTracking';

function Navbar() {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-orange-600">
            FoodOrder
          </Link>
          <div className="flex items-center gap-6">
            <Link
              to="/orders"
              className="text-gray-700 hover:text-orange-600 font-medium"
            >
              My Orders
            </Link>
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-orange-600 font-medium"
            >
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <CartProvider>
      <SocketProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/:orderId" element={<OrderTracking />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </SocketProvider>
    </CartProvider>
  );
}

export default App;

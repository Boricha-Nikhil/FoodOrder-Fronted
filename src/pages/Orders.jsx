import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import api from '../services/api';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Loader />;

  if (orders.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">No orders yet</h2>
        <p className="text-gray-500 mb-6">Place your first order from our menu!</p>
        <Link to="/">
          <Button>Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order._id} to={`/order/${order._id}`}>
            <Card className="p-5 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {order.items.map((i) => `${i.name} x${i.quantity}`).join(', ')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Total: <span className="font-semibold text-orange-600">${order.totalAmount.toFixed(2)}</span>
                  </p>
                </div>
                <Badge status={order.status} />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

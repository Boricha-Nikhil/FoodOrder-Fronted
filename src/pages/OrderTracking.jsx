import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../services/api';
import { useSocket } from '../context/SocketContext';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import Loader from '../components/ui/Loader';

const STATUSES = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];

export default function OrderTracking() {
  const { orderId } = useParams();
  const { orderStatus, joinOrder, isConnected } = useSocket();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [animatingStep, setAnimatingStep] = useState(-1);
  const hasJoined = useRef(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(orderId);
        setOrder(res.data.data);
        setLastUpdated(res.data.data.updatedAt);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!hasJoined.current && orderId) {
      joinOrder(orderId);
      hasJoined.current = true;
    }
  }, [orderId, joinOrder]);

  useEffect(() => {
    if (orderStatus && orderStatus.orderId === orderId) {
      const newStep = STATUSES.indexOf(orderStatus.status);
      setAnimatingStep(newStep);
      setOrder((prev) => (prev ? { ...prev, status: orderStatus.status } : prev));
      setLastUpdated(orderStatus.updatedAt || new Date().toISOString());

      const timer = setTimeout(() => setAnimatingStep(-1), 2000);
      return () => clearTimeout(timer);
    }
  }, [orderStatus, orderId]);

  if (loading) return <Loader />;
  if (!order) return <p className="text-center text-red-600 py-12">Order not found.</p>;

  const currentStep = STATUSES.indexOf(order.status);
  const isDelivered = order.status === 'Delivered';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-900">Order Tracking</h1>
        {!isDelivered && (
          <span className={`flex items-center gap-1.5 text-xs ${isConnected ? 'text-green-600' : 'text-red-500'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            {isConnected ? 'Live' : 'Connecting...'}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 mb-1">Order ID: {orderId}</p>
      {lastUpdated && (
        <p className="text-xs text-gray-400 mb-8">
          {isDelivered ? 'Delivered at' : 'Last updated'}:{' '}
          {new Date(lastUpdated).toLocaleTimeString()}
        </p>
      )}

      {isDelivered && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <svg className="w-6 h-6 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold text-green-800">Order Delivered Successfully!</p>
            <p className="text-sm text-green-600">Your order has been delivered. Enjoy your meal!</p>
          </div>
        </div>
      )}

      <Card hover={false} className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-800">Status</h2>
          <Badge status={order.status} />
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-8">
            {STATUSES.map((status, index) => {
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              const isAnimating = index === animatingStep;
              return (
                <div key={status} className="relative flex items-center gap-4">
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                      isCompleted
                        ? 'bg-orange-600 border-orange-600'
                        : 'bg-white border-gray-300'
                    } ${isAnimating ? 'scale-125 ring-4 ring-orange-200' : ''}`}
                  >
                    {isCompleted && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <span
                      className={`font-medium transition-colors duration-300 ${
                        isCurrent ? 'text-orange-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {status}
                    </span>
                    {isCurrent && !isDelivered && (
                      <span className="ml-2 inline-flex items-center gap-1 text-xs text-orange-500 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                        Current
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <Card hover={false} className="p-6">
        <h2 className="font-semibold text-gray-800 mb-4">Order Details</h2>
        <ul className="divide-y divide-gray-100 mb-4">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between py-2 text-sm">
              <span className="text-gray-700">
                {item.name} x{item.quantity}
              </span>
              <span className="font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between border-t pt-3 font-semibold">
          <span>Total</span>
          <span className="text-orange-600">${order.totalAmount.toFixed(2)}</span>
        </div>
        <div className="mt-4 pt-4 border-t text-sm text-gray-600">
          <p><strong>Name:</strong> {order.customer.name}</p>
          <p><strong>Address:</strong> {order.customer.address}</p>
          <p><strong>Phone:</strong> {order.customer.phone}</p>
        </div>
      </Card>
    </div>
  );
}

const statusColors = {
  'Order Received': 'bg-blue-100 text-blue-800',
  Preparing: 'bg-yellow-100 text-yellow-800',
  'Out for Delivery': 'bg-purple-100 text-purple-800',
  Delivered: 'bg-green-100 text-green-800',
};

export default function Badge({ status, className = '' }) {
  const color = statusColors[status] || 'bg-gray-100 text-gray-800';
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${color} ${className}`}
    >
      {status}
    </span>
  );
}

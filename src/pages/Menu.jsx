import { useState, useEffect } from 'react';
import { getMenuItems } from '../services/api';
import { useCart } from '../context/CartContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Dropdown from '../components/ui/Dropdown';
import Loader from '../components/ui/Loader';

const categories = [
  { value: 'pizza', label: 'Pizza' },
  { value: 'burger', label: 'Burgers' },
  { value: 'drinks', label: 'Drinks' },
  { value: 'dessert', label: 'Desserts' },
];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const res = await getMenuItems(category || undefined);
        setItems(res.data.data);
      } catch (err) {
        console.error('Failed to fetch menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [category]);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Our Menu</h1>
        <Dropdown
          options={categories}
          placeholder="All Categories"
          value={category}
          onChange={setCategory}
          className="w-full sm:w-48"
        />
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item._id}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <span className="text-orange-600 font-bold">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{item.description}</p>
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => addToCart(item)}
                >
                  Add to Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

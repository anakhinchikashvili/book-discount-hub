import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../api/orderService';

function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      // შესვლის შემდეგ ისევ /cart-ზე დაბრუნდეს
      navigate('/login', { state: { message: 'შეკვეთის გასაფორმებლად საჭიროა შესვლა' } });
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((item) => ({ bookId: item.bookId, quantity: item.quantity }));
      await placeOrder(shippingAddress, orderItems);
      clearCart();
      navigate('/orders', { state: { message: 'შეკვეთა წარმატებით გაფორმდა!' } });
    } catch (err) {
      setError(err.response?.data || 'შეკვეთის გაფორმებისას მოხდა შეცდომა');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h3>კალათა ცარიელია</h3>
        <Link to="/" className="btn btn-primary mt-3">
          წიგნების დათვალიერება
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">კალათა</h2>

      {items.map((item) => (
        <div key={item.bookId} className="card mb-3">
          <div className="card-body d-flex align-items-center">
            <img
              src={item.coverImageUrl || 'https://placehold.co/60x80?text=No+Cover'}
              alt={item.title}
              style={{ width: '60px', height: '80px', objectFit: 'cover' }}
              className="me-3"
            />

            <div className="flex-grow-1">
              <h6 className="mb-1">{item.title}</h6>
              <p className="text-muted small mb-1">
                {item.author} · {item.publisherBrandName}
              </p>
              <p className="fw-bold mb-0">{item.finalPrice.toFixed(2)} ₾</p>
            </div>

            <div className="d-flex align-items-center me-3">
              <input
                type="number"
                min={1}
                max={item.stock}
                value={item.quantity}
                onChange={(e) => updateQuantity(item.bookId, parseInt(e.target.value, 10) || 1)}
                className="form-control form-control-sm"
                style={{ width: '70px' }}
              />
            </div>

            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => removeFromCart(item.bookId)}
            >
              წაშლა
            </button>
          </div>
        </div>
      ))}

      <div className="card">
        <div className="card-body">
          <h5 className="d-flex justify-content-between">
            <span>ჯამი:</span>
            <span>{totalPrice.toFixed(2)} ₾</span>
          </h5>

          {error && <div className="alert alert-danger mt-3">{error}</div>}

          <form onSubmit={handleCheckout} className="mt-3">
            <div className="mb-3">
              <label className="form-label">მიტანის მისამართი</label>
              <input
                type="text"
                className="form-control"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'ფორმდება...' : 'შეკვეთის გაფორმება'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cart;
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../api/orderService';

const REGIONAL_SHIPPING_FEE = 10;
const PHONE_PATTERN = /^5\d{8}$/; // ქართული მობილური: 9 ციფრი, 5-ით დაწყებული

function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isPhoneValid = phoneNumber === '' || PHONE_PATTERN.test(phoneNumber);

  // frontend-ის მხარეს გამოთვლილი მიწოდების საფასურის preview - ეს მხოლოდ
  // UX-ისთვისაა (მომხმარებელი მაშინვე ხედავს); რეალურ, საბოლოო თანხას
  // ბექენდი ხელახლა ითვლის checkout-ის მომენტში (იგივე ლოგიკით), ასე რომ
  // frontend-ის გამოთვლაზე ვერასდროს "ვენდობით" ბრმად ფინანსური თვალსაზრისით.
  const isTbilisi = shippingAddress.toLowerCase().includes('თბილისი');
  const shippingFee = shippingAddress.trim() === '' ? 0 : isTbilisi ? 0 : REGIONAL_SHIPPING_FEE;
  const grandTotal = useMemo(() => totalPrice + shippingFee, [totalPrice, shippingFee]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      // შესვლის შემდეგ ისევ /cart-ზე დაბრუნდეს
      navigate('/login', { state: { message: 'შეკვეთის გასაფორმებლად საჭიროა შესვლა' } });
      return;
    }

    if (!shippingAddress.trim() || !phoneNumber.trim()) {
      setError('მისამართი და ტელეფონის ნომერი სავალდებულოა');
      return;
    }

    if (!PHONE_PATTERN.test(phoneNumber)) {
      setError('ტელეფონის ნომერი უნდა შედგებოდეს 9 ციფრისგან და იწყებოდეს 5-ით (მაგ. 599123456)');
      return;
    }

    setLoading(true);
    try {
      const orderItems = items.map((item) => ({ bookId: item.bookId, quantity: item.quantity }));
      await placeOrder(shippingAddress, phoneNumber, orderItems);
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
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleCheckout}>
            <div className="mb-3">
              <label className="form-label">მიტანის მისამართი</label>
              <input
                type="text"
                className="form-control"
                placeholder="მაგ. თბილისი, ვაჟა-ფშაველას გამზ. 10"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">ტელეფონის ნომერი</label>
              <input
                type="tel"
                className={`form-control ${phoneNumber && !isPhoneValid ? 'is-invalid' : ''}`}
                placeholder="599XXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))}
                required
              />
              {phoneNumber && !isPhoneValid && (
                <div className="invalid-feedback">
                  ნომერი უნდა შედგებოდეს ზუსტად 9 ციფრისგან და იწყებოდეს 5-ით
                </div>
              )}
            </div>

            {shippingAddress.trim() !== '' && (
              <div className={`alert ${isTbilisi ? 'alert-success' : 'alert-info'} py-2`}>
                {isTbilisi
                  ? 'მიწოდება: უფასო (0 ₾)'
                  : `მიწოდება (რეგიონი): ${REGIONAL_SHIPPING_FEE} ₾`}
              </div>
            )}

            <div className="border-top pt-3 mt-3">
              <div className="d-flex justify-content-between text-muted">
                <span>წიგნების ჯამი:</span>
                <span>{totalPrice.toFixed(2)} ₾</span>
              </div>
              <div className="d-flex justify-content-between text-muted">
                <span>მიწოდება:</span>
                <span>{shippingFee.toFixed(2)} ₾</span>
              </div>
              <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
                <span>სულ გადასახდელი:</span>
                <span>{grandTotal.toFixed(2)} ₾</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-3"
              disabled={loading || !isPhoneValid || phoneNumber.length !== 9}
            >
              {loading ? 'ფორმდება...' : 'შეკვეთის გაფორმება'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cart;
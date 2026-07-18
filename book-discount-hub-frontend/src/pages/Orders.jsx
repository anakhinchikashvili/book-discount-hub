import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../api/orderService';

const STATUS_LABELS = {
  PENDING: { text: 'მიმდინარეობს დამუშავება', className: 'bg-warning text-dark' },
  CONFIRMED: { text: 'დადასტურებულია', className: 'bg-info text-dark' },
  SHIPPED: { text: 'გზაშია', className: 'bg-primary' },
  DELIVERED: { text: 'მიწოდებულია', className: 'bg-success' },
  CANCELLED: { text: 'გაუქმებულია', className: 'bg-danger' },
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'შეკვეთების სანახავად საჭიროა შესვლა' } });
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await getMyOrders();
        setOrders(response.data);
      } catch (err) {
        setError('შეკვეთების ჩატვირთვა ვერ მოხერხდა');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">ჩემი შეკვეთები</h2>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!error && orders.length === 0 && (
        <div className="text-center mt-5">
          <p className="text-muted">შეკვეთები ჯერ არ გაქვს გაფორმებული.</p>
          <Link to="/" className="btn btn-primary">
            წიგნების დათვალიერება
          </Link>
        </div>
      )}

      {orders.map((order) => {
        const status = STATUS_LABELS[order.status] || { text: order.status, className: 'bg-secondary' };

        return (
          <div key={order.id} className="card mb-3">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>
                შეკვეთა #{order.id} · {new Date(order.orderDate).toLocaleDateString('ka-GE')}
              </span>
              <span className={`badge ${status.className}`}>{status.text}</span>
            </div>

            <div className="card-body">
              <p className="text-muted small mb-3">მისამართი: {order.shippingAddress}</p>

              {order.items.map((item, idx) => (
                <div key={idx} className="d-flex justify-content-between border-bottom py-2">
                  <div>
                    <div>{item.bookTitle}</div>
                    <div className="text-muted small">
                      {item.publisherBrandName} · {item.quantity} ცალი
                    </div>
                  </div>
                  <div className="fw-bold">
                    {(item.priceAtPurchase * item.quantity).toFixed(2)} ₾
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-between mt-3 fw-bold fs-5">
                <span>ჯამი:</span>
                <span>{order.totalPrice.toFixed(2)} ₾</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Orders;
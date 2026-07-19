import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

function RestockToast() {
  const { restockAlerts, dismissRestockAlert } = useWishlist();

  if (restockAlerts.length === 0) return null;

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
      {restockAlerts.map((alert) => (
        <div key={alert.id} className="toast show" role="alert">
          <div className="toast-header">
            <i className="bi bi-heart-fill text-danger me-2"></i>
            <strong className="me-auto">Wishlist-ის განახლება</strong>
            <button
              type="button"
              className="btn-close"
              onClick={() => dismissRestockAlert(alert.id)}
            ></button>
          </div>
          <div className="toast-body">
            <Link to={`/books/${alert.id}`}>{alert.title}</Link> ისევ მარაგშია!
          </div>
        </div>
      ))}
    </div>
  );
}

export default RestockToast;
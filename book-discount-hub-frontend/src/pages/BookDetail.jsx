import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookById } from '../api/bookService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext'; 

function BookDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isPublisher, isAdmin } = useAuth();
  const isBuyer = !isPublisher && !isAdmin;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const inWishlist = book ? isInWishlist(book.id) : false;


  useEffect(() => {
    setLoading(true);
    setError('');
    setAdded(false);
    setQty(1);

    getBookById(id)
      .then((res) => setBook(res.data))
      .catch(() => setError('წიგნი ვერ მოიძებნა'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(book, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-muted">{error || 'წიგნი ვერ მოიძებნა'}</p>
        <Link to="/" className="btn btn-primary">
          მთავარ გვერდზე დაბრუნება
        </Link>
      </div>
    );
  }

  const outOfStock = book.quantity === 0;
  const hasDiscount = book.discountPercentage > 0;

  return (
    <div className="container mt-4 mb-5">
      <Link to="/" className="btn btn-outline-secondary btn-sm mb-4">
        ← უკან დაბრუნება
      </Link>

      <div className="row g-4">
        <div className="col-md-5">
          <img
            src={book.coverImageUrl || 'https://placehold.co/400x550?text=No+Cover'}
            alt={book.title}
            className="img-fluid rounded shadow-sm"
            style={{ width: '100%', objectFit: 'cover' }}
          />
        </div>

        <div className="col-md-7">
          <h2 className="mb-1">{book.title}</h2>
          <p className="text-muted mb-1">{book.author}</p>
          <p className="text-muted small mb-3">გამომცემელი: {book.publisherBrandName}</p>

          <div className="mb-3">
            {hasDiscount ? (
              <>
                <span className="text-decoration-line-through text-muted me-2 fs-5">
                  {book.price.toFixed(2)} ₾
                </span>
                <span className="fw-bold text-danger fs-3">{book.finalPrice.toFixed(2)} ₾</span>
                <span className="badge bg-danger ms-2">-{book.discountPercentage}%</span>
              </>
            ) : (
              <span className="fw-bold fs-3">{book.finalPrice.toFixed(2)} ₾</span>
            )}
          </div>

          {book.description && <p className="mb-4">{book.description}</p>}

          <p className="mb-3">
            {outOfStock ? (
              <span className="badge bg-danger">ამოწურულია</span>
            ) : (
              <span className="text-muted small">მარაგშია: {book.quantity} ცალი</span>
            )}
          </p>

          {isBuyer && !outOfStock && (
            <div className="d-flex align-items-center gap-3">
              <input
                type="number"
                min="1"
                max={book.quantity}
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, Math.min(Number(e.target.value), book.quantity)))
                }
                className="form-control"
                style={{ width: '80px' }}
              />
              <button className="btn btn-primary" onClick={handleAddToCart}>
                {added ? 'დამატებულია ✓' : 'კალათაში დამატება'}
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={() => toggleWishlist(book)}
                title={inWishlist ? 'წაშლა Wishlist-იდან' : 'დამატება Wishlist-ში'}
              >
                <i className={`bi ${inWishlist ? 'bi-heart-fill' : 'bi-heart'}`}></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetail;
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function BookCard({ book }) {
  const { addToCart } = useCart();
  const { isPublisher, isAdmin } = useAuth();
  const isBuyer = !isPublisher && !isAdmin;

  const outOfStock = book.quantity === 0;
  const hasDiscount = book.discountPercentage > 0;

  return (
    <div className="col-6 col-md-4 col-lg-3 mb-4">
      <div className="card h-100 shadow-sm">
        <Link to={`/books/${book.id}`}>
          <img
            src={book.coverImageUrl || 'https://placehold.co/300x400?text=No+Cover'}
            className="card-img-top"
            alt={book.title}
            style={{ height: '260px', objectFit: 'cover' }}
          />
        </Link>

        <div className="card-body d-flex flex-column">
          <h6 className="card-title mb-1">
            <Link to={`/books/${book.id}`} className="text-dark text-decoration-none">
              {book.title}
            </Link>
          </h6>
          <p className="text-muted small mb-1">{book.author}</p>
          <p className="text-muted small mb-2">{book.publisherBrandName}</p>

          <div className="mt-auto">
            {hasDiscount ? (
              <div className="mb-2">
                <span className="text-decoration-line-through text-muted small me-2">
                  {book.price.toFixed(2)} ₾
                </span>
                <span className="fw-bold text-danger">{book.finalPrice.toFixed(2)} ₾</span>
                <span className="badge bg-danger ms-2">-{book.discountPercentage}%</span>
              </div>
            ) : (
              <div className="mb-2 fw-bold">{book.finalPrice.toFixed(2)} ₾</div>
            )}

            {isBuyer ? (
              <button
                className="btn btn-primary btn-sm w-100"
                disabled={outOfStock}
                onClick={() => addToCart(book)}
              >
                {outOfStock ? 'ამოწურულია' : 'კალათაში დამატება'}
              </button>
            ) : (
              <Link to={`/books/${book.id}`} className="btn btn-outline-primary btn-sm w-100">
                დეტალურად ნახვა
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
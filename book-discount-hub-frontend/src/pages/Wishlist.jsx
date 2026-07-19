import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

function Wishlist() {
  const { items, refreshRestocks, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  // ეშვება კომპონენტის ეკრანზე გამოჩენისას (mount-ზე) მარაგების გადასამოწმებლად
  useEffect(() => {
    refreshRestocks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (items.length === 0) {
    return (
      <div className="container text-center mt-5">
        <p className="text-muted">Wishlist ცარიელია.</p>
        <Link to="/" className="btn btn-primary">
          წიგნების დათვალიერება
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">ჩემი Wishlist</h2>

      <div className="row">
        {items.map((book) => {
          const outOfStock = book.quantity === 0;
          return (
            <div key={book.id} className="col-6 col-md-4 col-lg-3 mb-4">
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
                  <p className="text-muted small mb-2">{book.author}</p>
                  <div className="fw-bold mb-2">{book.finalPrice.toFixed(2)} ₾</div>

                  <div className="mt-auto d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm flex-grow-1"
                      disabled={outOfStock}
                      onClick={() => addToCart(book)}
                    >
                      {outOfStock ? 'ამოწურულია' : 'კალათაში დამატება'}
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => toggleWishlist(book)}
                      title="წაშლა Wishlist-იდან"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Wishlist;
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

/**
 * Navbar კომპონენტი - auth მდგომარეობა AuthContext-იდან, კალათის რაოდენობა CartContext-იდან.
 */
function Navbar() {
  const { isAuthenticated, isPublisher, isAdmin, user, logout } = useAuth();
  const { itemCount } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Publisher/Admin ანგარიშები არ არიან მყიდველები - მათთვის Cart/Wishlist აზრს კარგავს
  const isBuyer = !isPublisher && !isAdmin;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setSearchTerm('');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-2">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          Book Discount Hub
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <form
            className="d-flex mx-auto my-2 my-lg-0"
            style={{ maxWidth: '400px', width: '100%' }}
            onSubmit={handleSearchSubmit}
          >
            <input
              type="search"
              className="form-control"
              placeholder="მოძებნე წიგნი..."
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-primary ms-2" type="submit">
              <i className="bi bi-search"></i>
            </button>
          </form>

          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                მთავარი
              </NavLink>
            </li>

            {isPublisher && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/publisher-dashboard">
                  Publisher Dashboard
                </NavLink>
              </li>
            )}

            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">
                  Admin Dashboard
                </NavLink>
              </li>
            )}

            {isBuyer && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/wishlist">
                  <i className="bi bi-heart"></i> Wishlist
                </NavLink>
              </li>
            )}

            {isBuyer && (
              <li className="nav-item">
                <NavLink className="nav-link position-relative" to="/cart">
                  <i className="bi bi-cart"></i> კალათა
                  {itemCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {itemCount}
                      <span className="visually-hidden">ნივთი კალათაში</span>
                    </span>
                  )}
                </NavLink>
              </li>
            )}

            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person-circle"></i> {user.fullName}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/profile">
                      პროფილი
                    </Link>
                  </li>
                  {isBuyer && (
                    <li>
                      <Link className="dropdown-item" to="/orders">
                        ჩემი შეკვეთები
                      </Link>
                    </li>
                  )}
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      გასვლა
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink className="nav-link" to="/login">
                  <i className="bi bi-box-arrow-in-right"></i> შესვლა
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
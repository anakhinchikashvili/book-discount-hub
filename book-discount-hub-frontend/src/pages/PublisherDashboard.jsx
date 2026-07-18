import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBooks, createBook, updateBook, deleteBook } from '../api/bookService';
import { getPublisherOrders } from '../api/orderService';
import { getAllGenres } from '../api/genreService';
import BookForm from '../components/BookForm';

function PublisherDashboard() {
  const { isAuthenticated, isPublisher } = useAuth();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [genres, setGenres] = useState([]);
  const [activeTab, setActiveTab] = useState('books'); // 'books' | 'orders'

  const [editingBook, setEditingBook] = useState(null); // null = ფორმა დახურულია
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isPublisher) {
      navigate('/login', { state: { message: 'ეს გვერდი მხოლოდ გამომცემლებისთვისაა' } });
      return;
    }
    loadData();
  }, [isAuthenticated, isPublisher, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [booksRes, genresRes] = await Promise.all([getMyBooks(), getAllGenres()]);
      setBooks(booksRes.data);
      setGenres(genresRes.data);
    } catch (err) {
      setError('მონაცემების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await getPublisherOrders();
      setOrders(res.data);
    } catch (err) {
      setError('შეკვეთების ჩატვირთვა ვერ მოხერხდა');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'orders' && orders.length === 0) {
      loadOrders();
    }
  };

  const handleAddNew = () => {
    setEditingBook(null);
    setShowForm(true);
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    setError('');
    try {
      if (editingBook) {
        await updateBook(editingBook.id, formData);
      } else {
        await createBook(formData);
      }
      setShowForm(false);
      setEditingBook(null);
      await loadData();
    } catch (err) {
      // მაგ. "თქვენი ანგარიში ჯერ არ არის ადმინის მიერ დამტკიცებული"
      setError(err.response?.data || 'შეცდომა წიგნის შენახვისას');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('დარწმუნებული ხარ, რომ გინდა ამ წიგნის წაშლა?')) return;
    try {
      await deleteBook(bookId);
      await loadData();
    } catch (err) {
      setError(err.response?.data || 'შეცდომა წიგნის წაშლისას');
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">გამომცემლის პანელი</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'books' ? 'active' : ''}`}
            onClick={() => handleTabChange('books')}
          >
            ჩემი წიგნები
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => handleTabChange('orders')}
          >
            შეკვეთები
          </button>
        </li>
      </ul>

      {activeTab === 'books' && (
        <>
          {!showForm && (
            <button className="btn btn-primary mb-4" onClick={handleAddNew}>
              + ახალი წიგნის დამატება
            </button>
          )}

          {showForm && (
            <BookForm
              initialData={editingBook}
              genres={genres}
              submitting={submitting}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingBook(null);
              }}
            />
          )}

          {books.length === 0 ? (
            <p className="text-muted">ჯერ არცერთი წიგნი არ დაგიმატებია.</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>სათაური</th>
                  <th>ავტორი</th>
                  <th>ფასი</th>
                  <th>მარაგი</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.finalPrice.toFixed(2)} ₾</td>
                    <td>
                      {book.quantity === 0 ? (
                        <span className="badge bg-danger">ამოწურულია</span>
                      ) : (
                        book.quantity
                      )}
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(book)}
                      >
                        რედაქტირება
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(book.id)}
                      >
                        წაშლა
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {activeTab === 'orders' && (
        <>
          {orders.length === 0 ? (
            <p className="text-muted">ჯერ არცერთი შეკვეთა არ დაგფიქსირებია.</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>წიგნი</th>
                  <th>რაოდენობა</th>
                  <th>ფასი (შესყიდვისას)</th>
                  <th>ჯამი</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.bookTitle}</td>
                    <td>{item.quantity}</td>
                    <td>{item.priceAtPurchase.toFixed(2)} ₾</td>
                    <td className="fw-bold">
                      {(item.priceAtPurchase * item.quantity).toFixed(2)} ₾
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default PublisherDashboard;
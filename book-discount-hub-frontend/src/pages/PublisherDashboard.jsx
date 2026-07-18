import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyBooks, createBook, updateBook, deleteBook } from '../api/bookService';
import { getPublisherOrders, updateOrderItemStatus } from '../api/orderService';
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

  const handleStatusChange = async (orderItemId, newStatus) => {
    try {
      const res = await updateOrderItemStatus(orderItemId, newStatus);
      setOrders((prev) => prev.map((item) => (item.id === orderItemId ? res.data : item)));
    } catch (err) {
      setError(err.response?.data || 'სტატუსის შეცვლა ვერ მოხერხდა');
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
            <div className="d-flex flex-column gap-3">
              {orders.map((item) => (
                <div key={item.id} className="card">
                  <div className="card-body">
                    <div className="row g-3 align-items-start">
                      <div className="col-md-4">
                        <h6 className="mb-1">{item.bookTitle}</h6>
                        <p className="text-muted small mb-0">
                          {item.quantity} ცალი · {item.priceAtPurchase.toFixed(2)} ₾/ცალი
                        </p>
                        <p className="fw-bold mb-0">
                          ჯამი: {(item.priceAtPurchase * item.quantity).toFixed(2)} ₾
                        </p>
                      </div>

                      <div className="col-md-5">
                        <p className="text-muted small mb-1 text-uppercase" style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>
                          მყიდველი
                        </p>
                        <p className="mb-1">{item.buyerName}</p>
                        <p className="text-muted small mb-0">{item.shippingAddress}</p>
                      </div>

                      <div className="col-md-3">
                        <label className="form-label small text-muted mb-1">სტატუსი</label>
                        <select
                          className="form-select form-select-sm"
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        >
                          <option value="PENDING">მიმდინარეობს დამუშავება</option>
                          <option value="CONFIRMED">დადასტურებულია</option>
                          <option value="SHIPPED">გზაშია</option>
                          <option value="DELIVERED">მიწოდებულია</option>
                          <option value="CANCELLED">გაუქმებულია</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PublisherDashboard;
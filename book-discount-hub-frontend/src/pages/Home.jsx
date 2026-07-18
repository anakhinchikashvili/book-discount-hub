import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllBooks, searchBooks } from '../api/bookService';
import BookCard from '../components/BookCard';

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const response = keyword ? await searchBooks(keyword) : await getAllBooks();
        setBooks(response.data);
      } catch (err) {
        setError('წიგნების ჩატვირთვა ვერ მოხერხდა');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [keyword]);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">{keyword ? `ძებნის შედეგები: "${keyword}"` : 'ყველა წიგნი'}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {!error && books.length === 0 && (
        <p className="text-muted">წიგნები ვერ მოიძებნა.</p>
      )}

      <div className="row">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

export default Home;
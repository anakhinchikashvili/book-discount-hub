import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { filterBooks } from '../api/bookService';
import BookCard from '../components/BookCard';
import FilterBar from '../components/FilterBar';

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q');

  // keyword მხოლოდ URL-იდან (Navbar-ის ძებნა) მოდის - FilterBar-ს საკუთარი
  // keyword-input აღარ აქვს, ამიტომ ის ყოველ ჯერზე ხელით ვურთავთ ფილტრის პარამეტრებს
  useEffect(() => {
    runFilter({ genreId: null, minPrice: null, maxPrice: null, sortBy: 'newest' });
  }, [keyword]);

  const runFilter = async (filtersWithoutKeyword) => {
    setLoading(true);
    setError('');
    try {
      const response = await filterBooks({ ...filtersWithoutKeyword, keyword: keyword || null });
      setBooks(response.data);
    } catch (err) {
      setError('წიგნების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">{keyword ? `ძებნის შედეგები: "${keyword}"` : 'ყველა წიგნი'}</h2>

      <FilterBar onApply={runFilter} />

      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <>
          {error && <div className="alert alert-danger">{error}</div>}

          {!error && books.length === 0 && (
            <p className="text-muted">წიგნები ვერ მოიძებნა.</p>
          )}

          <div className="row">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
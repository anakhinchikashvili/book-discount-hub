import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { filterBooks } from '../api/bookService';
import BookCard from '../components/BookCard';
import FilterBar from '../components/FilterBar';

const BOOKS_PER_PAGE = 12;

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q');

  useEffect(() => {
    runFilter({ genreId: null, minPrice: null, maxPrice: null, sortBy: 'newest' });
  }, [keyword]);

  const runFilter = async (filtersWithoutKeyword) => {
    setLoading(true);
    setError('');
    setCurrentPage(1); // ახალი ფილტრი/ძებნა ყოველთვის პირველ გვერდზე იწყება
    try {
      const response = await filterBooks({ ...filtersWithoutKeyword, keyword: keyword || null });
      setBooks(response.data);
    } catch (err) {
      setError('წიგნების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(books.length / BOOKS_PER_PAGE);
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const visibleBooks = books.slice(startIndex, startIndex + BOOKS_PER_PAGE);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // ახალ გვერდზე ზემოთ დაბრუნება
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
            {visibleBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                    წინა
                  </button>
                </li>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => goToPage(page)}>
                      {page}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                    შემდეგი
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
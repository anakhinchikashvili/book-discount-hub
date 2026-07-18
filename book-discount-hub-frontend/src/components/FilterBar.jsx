import React, { useState, useEffect } from 'react';
import { getAllGenres } from '../api/genreService';

const SORT_OPTIONS = [
  { value: 'newest', label: 'უახლესი' },
  { value: 'price_asc', label: 'ფასი: დაბლიდან მაღლა' },
  { value: 'price_desc', label: 'ფასი: მაღლიდან დაბლა' },
  { value: 'discount_desc', label: 'ფასდაკლების მიხედვით' },
];

/**
 * onApply(filters) - გამოძახება ხდება ღილაკზე დაჭერისას, არა ყოველ input-ცვლილებაზე,
 * რომ ყოველ სიმბოლოზე request არ გაეშვას.
 * keyword აქ განზრახ არ არის - ეს მხოლოდ Navbar-ის საძიებო ველის პასუხისმგებლობაა,
 * Home.jsx ამ keyword-ს ცალკე ინახავს და ყველა filterBooks() request-ს ურთავს.
 */
function FilterBar({ onApply }) {
  const [genres, setGenres] = useState([]);
  const [genreId, setGenreId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    getAllGenres()
      .then((res) => setGenres(res.data))
      .catch(() => {}); // ჟანრების ჩატვირთვის შეცდომა კრიტიკული არაა - ფილტრი უბრალოდ ამ ველის გარეშე იმუშავებს
  }, []);

  const handleApply = (e) => {
    e.preventDefault();
    onApply({
      genreId: genreId || null,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null,
      sortBy,
    });
  };

  const handleReset = () => {
    setGenreId('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    onApply({ genreId: null, minPrice: null, maxPrice: null, sortBy: 'newest' });
  };

  return (
    <form onSubmit={handleApply} className="card card-body mb-4">
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label small">ჟანრი</label>
          <select
            className="form-select"
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
          >
            <option value="">ყველა ჟანრი</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-2">
          <label className="form-label small">ფასი, დან (₾)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="form-control"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="col-6 col-md-2">
          <label className="form-label small">ფასი, მდე (₾)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="form-control"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label small">დალაგება</label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ღილაკები ცალკე, სრულ სიგანეზე - ვიწრო სვეტში ტექსტი ჩარჩოდან გადიოდა */}
      <div className="d-flex gap-2 mt-3">
        <button type="submit" className="btn btn-primary">
          გაფილტვრა
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
          გასუფთავება
        </button>
      </div>
    </form>
  );
}

export default FilterBar;
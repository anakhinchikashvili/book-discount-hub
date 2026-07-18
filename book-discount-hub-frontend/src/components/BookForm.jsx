import React, { useState, useEffect } from 'react';

const emptyForm = {
  title: '',
  author: '',
  description: '',
  price: '',
  discountPercentage: 0,
  quantity: 0,
  coverImageUrl: '',
  genreIds: [],
};

/**
 * initialData - თუ გადმოეცემა, ფორმა edit-რეჟიმშია.
 * genres - ხელმისაწვდომი ჟანრების სია [{id, name}, ...]
 */
function BookForm({ initialData, genres, onSubmit, onCancel, submitting }) {
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        description: initialData.description || '',
        price: initialData.price ?? '',
        discountPercentage: initialData.discountPercentage ?? 0,
        quantity: initialData.quantity ?? 0,
        coverImageUrl: initialData.coverImageUrl || '',
        // BookResponse.genres არის Set<String> (სახელები) - ID-ებზე გადავყავართ genres სიის მიხედვით
        genreIds: genres
          .filter((g) => initialData.genres?.includes(g.name))
          .map((g) => g.id),
      });
    } else {
      setFormData(emptyForm);
    }
  }, [initialData, genres]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleGenre = (genreId) => {
    setFormData((prev) => {
      const isSelected = prev.genreIds.includes(genreId);
      return {
        ...prev,
        genreIds: isSelected
          ? prev.genreIds.filter((id) => id !== genreId)
          : [...prev.genreIds, genreId],
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price),
      discountPercentage: parseInt(formData.discountPercentage, 10),
      quantity: parseInt(formData.quantity, 10),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-4">
      <h5 className="mb-3">{initialData ? 'წიგნის რედაქტირება' : 'ახალი წიგნის დამატება'}</h5>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">სათაური</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">ავტორი</label>
          <input
            type="text"
            name="author"
            className="form-control"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">აღწერა</label>
        <textarea
          name="description"
          className="form-control"
          rows={3}
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">ფასი (₾)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">ფასდაკლება (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            name="discountPercentage"
            className="form-control"
            value={formData.discountPercentage}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">მარაგი (ცალი)</label>
          <input
            type="number"
            min="0"
            name="quantity"
            className="form-control"
            value={formData.quantity}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">ყდის სურათის URL (არასავალდებულო)</label>
        <input
          type="text"
          name="coverImageUrl"
          className="form-control"
          value={formData.coverImageUrl}
          onChange={handleChange}
        />
      </div>

      {genres.length > 0 && (
        <div className="mb-3">
          <label className="form-label d-block">ჟანრები</label>
          {genres.map((genre) => (
            <button
              type="button"
              key={genre.id}
              className={`btn btn-sm me-2 mb-2 ${
                formData.genreIds.includes(genre.id) ? 'btn-primary' : 'btn-outline-secondary'
              }`}
              onClick={() => toggleGenre(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      )}

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'ინახება...' : initialData ? 'შენახვა' : 'დამატება'}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
          გაუქმება
        </button>
      </div>
    </form>
  );
}

export default BookForm;
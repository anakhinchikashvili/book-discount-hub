import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../api/authService';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'USER',
    brandName: '',
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);

      // რეგისტრაცია არ ახდენს ავტომატურ login-ს - Publisher-ს ჯერ ადმინის
      // დამტკიცება სჭირდება, ამიტომ ორივე შემთხვევაში login გვერდზე ვაბრუნებთ
      const message =
        formData.role === 'PUBLISHER'
          ? 'რეგისტრაცია წარმატებით დასრულდა! ანგარიში გააქტიურდება ადმინის დამტკიცების შემდეგ.'
          : 'რეგისტრაცია წარმატებით დასრულდა! გთხოვთ შეხვიდეთ სისტემაში.';

      navigate('/login', { state: { message } });
    } catch (err) {
      setError(err.response?.data || 'რეგისტრაციისას მოხდა შეცდომა, სცადეთ თავიდან');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '480px', marginTop: '3rem', marginBottom: '3rem' }}>
      <h2 className="mb-4 text-center">რეგისტრაცია</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">სახელი გვარი</label>
          <input
            type="text"
            name="fullName"
            className="form-control"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">ელ. ფოსტა</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">პაროლი</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">ანგარიშის ტიპი</label>
          <select
            name="role"
            className="form-select"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="USER">მკითხველი</option>
            <option value="PUBLISHER">გამომცემელი</option>
          </select>
        </div>

        {formData.role === 'PUBLISHER' && (
          <>
            <div className="mb-3">
              <label className="form-label">გამომცემლობის სახელი</label>
              <input
                type="text"
                name="brandName"
                className="form-control"
                value={formData.brandName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">აღწერა (არასავალდებულო)</label>
              <textarea
                name="description"
                className="form-control"
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="alert alert-info small">
              გამომცემლის ანგარიშს ესაჭიროება ადმინისტრატორის დამტკიცება რეგისტრაციის შემდეგ.
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'იტვირთება...' : 'რეგისტრაცია'}
        </button>
      </form>

      <p className="text-center mt-3">
        უკვე გაქვს ანგარიში? <Link to="/login">შესვლა</Link>
      </p>
    </div>
  );
}

export default Register;
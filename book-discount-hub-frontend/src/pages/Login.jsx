import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(email, password);

      // როლის მიხედვით სხვადასხვა გვერდზე გადამისამართება
      if (userData.role === 'ADMIN') {
        navigate('/admin');
      } else if (userData.role === 'PUBLISHER') {
        navigate('/publisher-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      // ბექენდის GlobalExceptionHandler უბრალო ტექსტს აბრუნებს (არა JSON) 400-ზე
      setError(err.response?.data || 'შესვლისას მოხდა შეცდომა, სცადეთ თავიდან');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px', marginTop: '4rem' }}>
      <h2 className="mb-4 text-center">შესვლა</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {!error && successMessage && <div className="alert alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">ელ. ფოსტა</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">პაროლი</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'იტვირთება...' : 'შესვლა'}
        </button>
      </form>

      <p className="text-center mt-3">
        არ გაქვს ანგარიში? <Link to="/register">დარეგისტრირდი</Link>
      </p>
    </div>
  );
}

export default Login;
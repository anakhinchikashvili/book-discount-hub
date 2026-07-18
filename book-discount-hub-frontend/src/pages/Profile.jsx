import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser, changePassword } from '../api/authService';

const ROLE_LABELS = {
  USER: 'მკითხველი',
  PUBLISHER: 'გამომცემელი',
  ADMIN: 'ადმინისტრატორი',
};

function Profile() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    getCurrentUser()
      .then((res) => setProfile(res.data))
      .catch(() => setError('პროფილის ჩატვირთვა ვერ მოხერხდა'))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('ახალი პაროლები არ ემთხვევა ერთმანეთს');
      return;
    }

    setSubmitting(true);
    try {
      await changePassword(oldPassword, newPassword);
      setSuccess('პაროლი წარმატებით შეიცვალა');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data || 'პაროლის შეცვლისას მოხდა შეცდომა');
    } finally {
      setSubmitting(false);
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
    <div className="container mt-4 mb-5" style={{ maxWidth: '520px' }}>
      <h2 className="mb-4">პროფილი</h2>

      {profile && (
        <div className="card mb-4">
          <div className="card-body">
            <p className="mb-1">
              <strong>სახელი:</strong> {profile.fullName}
            </p>
            <p className="mb-1">
              <strong>ელ. ფოსტა:</strong> {profile.email}
            </p>
            <p className="mb-0">
              <strong>ანგარიშის ტიპი:</strong> {ROLE_LABELS[profile.role] || profile.role}
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <h5 className="mb-3">პაროლის შეცვლა</h5>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label className="form-label">ძველი პაროლი</label>
              <input
                type="password"
                className="form-control"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">ახალი პაროლი</label>
              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">გაიმეორე ახალი პაროლი</label>
              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
              {submitting ? 'ინახება...' : 'პაროლის შეცვლა'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
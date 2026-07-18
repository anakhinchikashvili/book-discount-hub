import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getPendingPublishers,
  approvePublisher,
  rejectPublisher,
  getAllUsers,
  blockUser,
  activateUser,
  getAllGenres,
  addGenre,
} from '../api/adminService';

function AdminDashboard() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('publishers'); // 'publishers' | 'users' | 'genres'
  const [pendingPublishers, setPendingPublishers] = useState([]);
  const [users, setUsers] = useState([]);
  const [genres, setGenres] = useState([]);
  const [newGenreName, setNewGenreName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/login', { state: { message: 'ეს გვერდი მხოლოდ ადმინისტრატორისთვისაა' } });
      return;
    }
    loadAll();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [pendingRes, usersRes, genresRes] = await Promise.all([
        getPendingPublishers(),
        getAllUsers(),
        getAllGenres(),
      ]);
      setPendingPublishers(pendingRes.data);
      setUsers(usersRes.data);
      setGenres(genresRes.data);
    } catch (err) {
      setError('მონაცემების ჩატვირთვა ვერ მოხერხდა');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (publisherProfileId) => {
    try {
      await approvePublisher(publisherProfileId);
      setPendingPublishers((prev) => prev.filter((p) => p.id !== publisherProfileId));
    } catch (err) {
      setError(err.response?.data || 'დამტკიცება ვერ მოხერხდა');
    }
  };

  const handleReject = async (publisherProfileId) => {
    try {
      await rejectPublisher(publisherProfileId);
      setPendingPublishers((prev) => prev.filter((p) => p.id !== publisherProfileId));
    } catch (err) {
      setError(err.response?.data || 'უარყოფა ვერ მოხერხდა');
    }
  };

  const handleToggleBlock = async (targetUser) => {
    try {
      if (targetUser.enabled) {
        await blockUser(targetUser.id);
      } else {
        await activateUser(targetUser.id);
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, enabled: !u.enabled } : u))
      );
    } catch (err) {
      setError(err.response?.data || 'სტატუსის შეცვლა ვერ მოხერხდა');
    }
  };

  const handleAddGenre = async (e) => {
    e.preventDefault();
    if (!newGenreName.trim()) return;
    try {
      const res = await addGenre(newGenreName.trim());
      setGenres((prev) => [...prev, res.data]);
      setNewGenreName('');
    } catch (err) {
      setError(err.response?.data || 'ჟანრის დამატება ვერ მოხერხდა');
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
      <h2 className="mb-4">ადმინისტრატორის პანელი</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'publishers' ? 'active' : ''}`}
            onClick={() => setActiveTab('publishers')}
          >
            გამომცემლების დამტკიცება
            {pendingPublishers.length > 0 && (
              <span className="badge bg-danger ms-2">{pendingPublishers.length}</span>
            )}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            მომხმარებლები
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'genres' ? 'active' : ''}`}
            onClick={() => setActiveTab('genres')}
          >
            ჟანრები
          </button>
        </li>
      </ul>

      {activeTab === 'publishers' && (
        <>
          {pendingPublishers.length === 0 ? (
            <p className="text-muted">დამტკიცების მოლოდინში მყოფი გამომცემელი არ არის.</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>გამომცემლობა</th>
                  <th>აღწერა</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {pendingPublishers.map((profile) => (
                  <tr key={profile.id}>
                    <td>{profile.brandName}</td>
                    <td className="text-muted small">{profile.description || '—'}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleApprove(profile.id)}
                      >
                        დამტკიცება
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleReject(profile.id)}
                      >
                        უარყოფა
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {activeTab === 'users' && (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>სახელი</th>
              <th>ელ. ფოსტა</th>
              <th>როლი</th>
              <th>სტატუსი</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.enabled ? (
                    <span className="badge bg-success">აქტიური</span>
                  ) : (
                    <span className="badge bg-danger">დაბლოკილი</span>
                  )}
                </td>
                <td className="text-end">
                  {u.role !== 'ADMIN' && (
                    <button
                      className={`btn btn-sm ${u.enabled ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => handleToggleBlock(u)}
                    >
                      {u.enabled ? 'დაბლოკვა' : 'გააქტიურება'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === 'genres' && (
        <>
          <form onSubmit={handleAddGenre} className="d-flex gap-2 mb-4" style={{ maxWidth: '400px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="ახალი ჟანრის სახელი"
              value={newGenreName}
              onChange={(e) => setNewGenreName(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              დამატება
            </button>
          </form>

          <div>
            {genres.map((genre) => (
              <span key={genre.id} className="badge bg-secondary me-2 mb-2 fs-6">
                {genre.name}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDashboard;
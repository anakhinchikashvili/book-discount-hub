import axiosInstance from './axiosInstance';

// ---------- Publisher Approval ----------

export const getPendingPublishers = () => axiosInstance.get('/admin/publishers/pending');

export const approvePublisher = (publisherProfileId) =>
  axiosInstance.put(`/admin/publishers/${publisherProfileId}/approve`);

export const rejectPublisher = (publisherProfileId) =>
  axiosInstance.put(`/admin/publishers/${publisherProfileId}/reject`);

// ---------- User ბლოკირება ----------

export const getAllUsers = () => axiosInstance.get('/admin/users');

export const blockUser = (userId) => axiosInstance.put(`/admin/users/${userId}/block`);

export const activateUser = (userId) => axiosInstance.put(`/admin/users/${userId}/activate`);

// ---------- ჟანრები ----------

export const getAllGenres = () => axiosInstance.get('/admin/genres');

export const addGenre = (name) => axiosInstance.post('/admin/genres', { name });
import axiosInstance from './axiosInstance';

// role: 'USER' ან 'PUBLISHER'. PUBLISHER-ისთვის დამატებით საჭიროა brandName.
export const register = (data) => {
  return axiosInstance.post('/users/register', data);
};

export const login = (email, password) => {
  return axiosInstance.post('/auth/login', { email, password });
};

export const getCurrentUser = () => axiosInstance.get('/users/me');

export const changePassword = (oldPassword, newPassword) => {
  return axiosInstance.put('/users/me/password', { oldPassword, newPassword });
};
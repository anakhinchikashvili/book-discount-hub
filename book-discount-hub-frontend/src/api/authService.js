import axiosInstance from './axiosInstance';

// role: 'USER' ან 'PUBLISHER'. PUBLISHER-ისთვის დამატებით საჭიროა brandName.
export const register = (data) => {
  return axiosInstance.post('/users/register', data);
};

export const login = (email, password) => {
  return axiosInstance.post('/auth/login', { email, password });
};
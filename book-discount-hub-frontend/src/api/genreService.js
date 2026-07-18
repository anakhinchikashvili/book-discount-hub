import axiosInstance from './axiosInstance';

export const getAllGenres = () => axiosInstance.get('/genres');
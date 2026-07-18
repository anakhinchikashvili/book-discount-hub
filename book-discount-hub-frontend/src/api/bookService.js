import axiosInstance from './axiosInstance';

// ---------- საჯარო კატალოგი ----------

export const getAllBooks = () => axiosInstance.get('/books');

export const getBookById = (id) => axiosInstance.get(`/books/${id}`);

export const searchBooks = (keyword) =>
  axiosInstance.get('/books/search', { params: { keyword } });

export const getBooksByGenre = (genreId) => axiosInstance.get(`/books/genre/${genreId}`);

// ---------- Publisher Dashboard (ტოკენი აუცილებელია) ----------

export const getMyBooks = () => axiosInstance.get('/books/my');

export const createBook = (bookData) => axiosInstance.post('/books', bookData);

export const updateBook = (id, bookData) => axiosInstance.put(`/books/${id}`, bookData);

export const deleteBook = (id) => axiosInstance.delete(`/books/${id}`);
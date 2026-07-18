import axiosInstance from './axiosInstance';

// ---------- საჯარო კატალოგი ----------

export const getAllBooks = () => axiosInstance.get('/books');

export const getBookById = (id) => axiosInstance.get(`/books/${id}`);

// params: { genreId, minPrice, maxPrice, keyword, sortBy } - ყველა optional-ია, ერთდროულად კომბინირებადია
export const filterBooks = (params) => axiosInstance.get('/books/filter', { params });

// ---------- Publisher Dashboard (ტოკენი აუცილებელია) ----------

export const getMyBooks = () => axiosInstance.get('/books/my');

export const createBook = (bookData) => axiosInstance.post('/books', bookData);

export const updateBook = (id, bookData) => axiosInstance.put(`/books/${id}`, bookData);

export const deleteBook = (id) => axiosInstance.delete(`/books/${id}`);
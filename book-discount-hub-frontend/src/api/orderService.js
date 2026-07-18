import axiosInstance from './axiosInstance';

// items: [{ bookId, quantity }, ...]
export const placeOrder = (shippingAddress, items) => {
  return axiosInstance.post('/orders', { shippingAddress, items });
};

export const getMyOrders = () => axiosInstance.get('/orders/my');

// Publisher Dashboard-ისთვის
export const getPublisherOrders = () => axiosInstance.get('/orders/publisher/my');
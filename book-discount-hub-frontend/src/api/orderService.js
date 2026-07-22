import axiosInstance from './axiosInstance';

// items: [{ bookId, quantity }, ...]
export const placeOrder = (shippingAddress, phoneNumber, items) => {
  return axiosInstance.post('/orders', { shippingAddress, phoneNumber, items });
};

export const getMyOrders = () => axiosInstance.get('/orders/my');

// Publisher Dashboard-ისთვის
export const getPublisherOrders = () => axiosInstance.get('/orders/publisher/my');

export const updateOrderItemStatus = (orderItemId, status) =>
  axiosInstance.put(`/orders/items/${orderItemId}/status`, { status });
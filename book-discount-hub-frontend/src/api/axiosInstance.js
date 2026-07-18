import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ყოველ გამავალ request-ს ავტომატურად ემატება Authorization header, თუ ტოკენი შენახულია
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// თუ ბექენდი 401-ს დააბრუნებს (ტოკენი ვადაგასულია/არასწორია), ავტომატურად ვასუფთავებთ
// შენახულ session-ს და login გვერდზე ვამისამართებთ მომხმარებელს
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('cart');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
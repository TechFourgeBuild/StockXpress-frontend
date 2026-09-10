import axiosInstance from './axiosConfig';

// ✅ Register
export const register = async (userData) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

// ✅ Login
export const login = async (credentials) => {
  const response = await axiosInstance.post('/auth/login', credentials);
  // ✅ Save token in localStorage
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  return response.data;
};

// ✅ Logout
export const logout = async () => {
  const response = await axiosInstance.post('/auth/logout');
  localStorage.removeItem('accessToken');
  return response.data;
};

// ✅ Refresh Token (Called automatically by interceptor)
export const refreshToken = async () => {
  const response = await axiosInstance.post('/auth/refresh-token');
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  return response.data;
};

// ✅ Get Current User Profile
export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me'); 
  return response.data;
};
import axiosInstance from './axios';

export const authApi = {
  login: (credentials) =>
    axiosInstance.post('/auth/login', credentials).then((r) => r.data),

  register: (payload) =>
    axiosInstance.post('/auth/register', payload).then((r) => r.data),

  googleLogin: (idToken) =>
    axiosInstance.post('/auth/google', { credential: idToken }).then((r) => r.data),

  me: () =>
    axiosInstance.get('/auth/me').then((r) => r.data),

  logout: () =>
    axiosInstance.post('/auth/logout').then((r) => r.data).catch(() => null),
};

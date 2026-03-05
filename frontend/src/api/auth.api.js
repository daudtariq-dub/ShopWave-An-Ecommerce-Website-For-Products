import axiosInstance from './axios';

// Normalize user from backend (role is uppercase enum → lowercase)
function normalizeUser(user) {
  if (!user) return user;
  return { ...user, role: user.role?.toLowerCase() };
}

export const authApi = {
  login: async ({ email, password }) => {
    const { data } = await axiosInstance.post('/auth/login', { email, password });
    return { token: data.token, user: normalizeUser(data.user) };
  },

  register: async ({ name, email, password }) => {
    const { data } = await axiosInstance.post('/auth/register', { name, email, password });
    return { token: data.token, user: normalizeUser(data.user) };
  },

  /** Sends the Google id_token to the backend for verification */
  googleLogin: async (credential) => {
    const { data } = await axiosInstance.post('/auth/google', { credential });
    return { token: data.token, user: normalizeUser(data.user) };
  },

  me: async () => {
    const { data } = await axiosInstance.get('/auth/me');
    return normalizeUser(data.user);
  },

  logout: async () => {
    await axiosInstance.post('/auth/logout');
    return { ok: true };
  },

  updateProfile: async (profileData) => {
    const { data } = await axiosInstance.patch('/auth/profile', profileData);
    return normalizeUser(data.user);
  },
};

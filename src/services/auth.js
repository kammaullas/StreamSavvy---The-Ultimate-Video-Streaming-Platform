import api from "./api";

export const loginUser = async (credentials) => {
  const { email, password } = credentials;
  // json-server allows filtering by query parameters
  const response = await api.get(`/users?email=${email}&password=${password}`);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const checkEmailExists = async (email) => {
  const response = await api.get(`/users?email=${email}`);
  return response.data.length > 0;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

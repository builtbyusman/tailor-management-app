import api from "./axios";

// Login user
export const loginUser = async (data) => {
  const response = await api.post("/auth/login", {
    email: data.email,
    password: data.password,
  });

  return response.data;
};

// Register user
export const registerUser = async (data) => {
  const response = await api.post("/auth/register", {
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
  });

  return response.data;
};
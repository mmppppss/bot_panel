import { apiRequest } from "../helpers/api";

export const loginUser = (email, password) => {
  return apiRequest("auth/login", "POST", {
    email,
    password
  });
};


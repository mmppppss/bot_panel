import { apiRequest } from "../helpers/api";
/*
 * Iniciar sesion
 */
export const loginUser = (email, password) => {
	return apiRequest("auth/login", "POST", {
		email,
		password,
	});
};

/*
 * REgistrar usuario
 * */
export const registerUser = (data) => {
	return apiRequest("user/create", "POST", data);
};

const API_URL = import.meta.env.VITE_API_URL;
/*
 * Capa de abstraccion para fetch
 * PEticiones de api
 */
export const apiRequest = async (
	endpoint,
	method = "GET",
	data = null,
	token = null,
) => {
	const headers = {
		"Content-Type": "application/json",
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const options = {
		method,
		headers,
	};

	if (data) {
		options.body = JSON.stringify(data);
	}

	try {
		const response = await fetch(`${API_URL}${endpoint}`, options);

		const text = await response.text();
		if (!text) {
			throw new Error("Respuesta vacía del servidor");
		}

		const result = JSON.parse(text);

		if (!response.ok) {
			throw new Error(
				result.message || result.error || `Error ${response.status}`,
			);
		}

		return result;
	} catch (error) {
		console.error("Error en la API:", error);
		throw error;
	}
};

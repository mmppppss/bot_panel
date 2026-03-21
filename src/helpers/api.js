const API_URL = "http://localhost:3000/api/v1/";//cambiar a env

export const apiRequest = async (endpoint, method = "GET", data = null, token=null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json"
    }
  };
  if (data) {
    options.body = JSON.stringify(data);
  }
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);    
    console.log(response);
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error en la API:", error);
  }
};

import { apiRequest } from "../helpers/api";
/**
 * Crear un agenete
 * @param {*} name : nombre del agente
 * @param {*} description: description del agente
 * @returns respuesta de la api
 */
export const Createagent = async (name, description) => {
	const id_user = localStorage.getItem("id_user");
	return apiRequest("user/" + id_user + "/agents/", "POST", {
		user: id_user,
		name,
		description,
	});
};

/**
 * Obtiene el qr conexion con whatsapp
 * @param {uuid} idAgent : id del agente
 * @returns una peticion de api
 */
export const getWhatsappQR = async (idAgent) => {
	const id_user = localStorage.getItem("id_user");
	return apiRequest(
		"user/" + id_user + "/agents/" + idAgent + "/connect?type=whatsapp",
		"POST",
		{},
	);
};

/**
 * obtiene los agentes asociados a un usuario
 * @returns la lista de agentes
 */
export const getAgents = async () => {
	const id_user = localStorage.getItem("id_user");
	return apiRequest("user/" + id_user + "/agents/", "GET");
};

/**
 * Enviar un mensaje a traves de un agente
 * @param {*} idAgent: el que envia el mensaje
 * @param {*} to: el numero que recive el mensaje
 * @param {*} text: el contenido del mensaje
 * @returns true
 */
export const sendMessage = async (idAgent, to, text) => {
	const id_user = localStorage.getItem("id_user");
	return apiRequest(
		"user/" + id_user + "/agents/" + idAgent + "/send",
		"POST",
		{ to, text },
	);
};

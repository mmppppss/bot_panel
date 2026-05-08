import { apiRequest } from "../helpers/api";

export const Createagent = async (name, description) => {
	const id_user = localStorage.getItem("id_user");
	return apiRequest("user/" + id_user + "/agents/", "POST", {
		user: id_user,
		name,
		description,
	});
};

export const getWhatsappQR = async (idAgent) => {
	const id_user = localStorage.getItem("id_user");
	return apiRequest(
		"user/" + id_user + "/agents/" + idAgent + "/connect?type=whatsapp",
		"POST",
		{},
	);
};

export const getAgents = async () => {
	const id_user = localStorage.getItem("id_user");
	return apiRequest("user/" + id_user + "/agents/", "GET");
};

export const sendMessage = async (idAgent, to, text) => {
	const id_user = localStorage.getItem("id_user");
	return apiRequest(
		"user/" + id_user + "/agents/" + idAgent + "/send",
		"POST",
		{ to, text },
	);
};

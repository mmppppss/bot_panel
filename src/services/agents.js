import { apiRequest } from "../helpers/api";

export const Createagent = async (id_user, name, description) => {
	return apiRequest("user/" + id_user + "/agents/", "POST", {
		user: id_user,
		name,
		description,
	});
};

export const getAgent = async (id_user, idAgent) => {
	return apiRequest("user/" + id_user + "/agents/" + idAgent, "GET");
};

export const updateAgent = async (id_user, idAgent, data) => {
	return apiRequest("user/" + id_user + "/agents/" + idAgent, "PUT", data);
};

export const getAgents = async (id_user) => {
	return apiRequest("user/" + id_user + "/agents/", "GET");
};

export const deleteAgent = async (id_user, idAgent) => {
	return apiRequest("user/" + id_user + "/agents/" + idAgent, "DELETE");
};

export const getWhatsappQR = async (id_user, idAgent) => {
	return apiRequest(
		"user/" + id_user + "/agents/" + idAgent + "/connect?type=whatsapp",
		"POST",
		{},
	);
};

export const connectTelegram = async (id_user, idAgent, apiKey) => {
	return apiRequest(
		"user/" + id_user + "/agents/" + idAgent + "/connect?type=telegram",
		"POST",
		{ token: apiKey },
	);
};

export const sendMessage = async (id_user, idAgent, to, text, provider) => {
	return apiRequest(
		"user/" + id_user + "/agents/" + idAgent + "/send",
		"POST",
		{ provider, to, text },
	);
};

export const getModules = async (id_user, idAgent) => {
	return apiRequest("agents/" + idAgent + "/modules", "GET");
};

export const upsertModule = async (id_user, idAgent, moduleKey, data) => {
	return apiRequest(
		"agents/" + idAgent + "/modules/" + moduleKey,
		"PUT",
		data,
	);
};

export const toggleModule = async (id_user, idAgent, moduleKey) => {
	return apiRequest(
		"agents/" + idAgent + "/modules/" + moduleKey + "/toggle",
		"POST",
	);
};

export const getResponses = async (idAgent) => {
	return apiRequest("agents/" + idAgent + "/responses", "GET");
};

export const createResponse = async (idAgent, data) => {
	return apiRequest("agents/" + idAgent + "/responses", "POST", data);
};

export const deleteResponse = async (idAgent, idResponse) => {
	return apiRequest("agents/" + idAgent + "/responses/" + idResponse, "DELETE");
};

// TODO: implementar cuando el endpoint esté disponible
export const updateResponse = async (idAgent, idResponse, data) => {
	// return apiRequest("agents/" + idAgent + "/responses/" + idResponse, "PUT", data);
	console.log("updateResponse — pendiente de implementar", { idAgent, idResponse, data });
};

export const getAgentConfigs = async (idAgent) => {
	return apiRequest("agents/" + idAgent + "/config", "GET");
};

export const setAgentConfig = async (idAgent, key, value) => {
	return apiRequest("agents/" + idAgent + "/config/" + key, "PUT", { value });
};

export const deleteAgentConfig = async (idAgent, key) => {
	return apiRequest("agents/" + idAgent + "/config/" + key, "DELETE");
};

export const getContacts = async (idAgent) => {
	return apiRequest("agents/" + idAgent + "/contacts", "GET");
};

export const createContact = async (idAgent, data) => {
	return apiRequest("agents/" + idAgent + "/contacts", "POST", data);
};

export const updateContact = async (idAgent, contactId, data) => {
	return apiRequest("agents/" + idAgent + "/contacts/" + contactId, "PUT", data);
};

export const deleteContact = async (idAgent, contactId) => {
	return apiRequest("agents/" + idAgent + "/contacts/" + contactId, "DELETE");
};

export const getMessages = async (idAgent, limit = 50, offset = 0) => {
	return apiRequest("agents/" + idAgent + "/messages?limit=" + limit + "&offset=" + offset, "GET");
};

export const uploadKnowledge = async (idAgent, data) => {
	return apiRequest("agents/" + idAgent + "/knowledge/upload", "POST", { data });
};

export const getKnowledge = async (idAgent) => {
	return apiRequest("agents/" + idAgent + "/knowledge", "GET");
};

export const getDeveloperKeys = async (idAgent) => {
	return apiRequest("developer/keys?idAgent=" + idAgent, "GET");
};

export const createDeveloperKey = async (idAgent, name) => {
	return apiRequest("developer/keys", "POST", { name, idAgent });
};

export const revokeDeveloperKey = async (idAgent, idKey) => {
	return apiRequest("developer/keys/" + idKey + "?idAgent=" + idAgent, "DELETE");
};

export const getDeveloperLogs = async (idAgent) => {
	return apiRequest("developer/logs?idAgent=" + idAgent, "GET");
};

import { apiRequest } from "../helpers/api";

export const Createagent = (name, description) => {

    const id_user = localStorage.getItem("id_user")
    return apiRequest("user/" + id_user + "/agents/", "POST", {
        user: id_user,
        name,
        description
    });
};
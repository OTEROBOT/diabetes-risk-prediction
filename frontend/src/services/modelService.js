import axios from "axios";
import API from "./api";

export const getModels = async () => {
    const res = await axios.get(`${API}/models`);
    return res.data;
};

export const deleteModel = async (id) => {
    return await axios.delete(`${API}/delete_model/${id}`);
};

export const activateModel = async (id) => {
    return await axios.put(`${API}/activate_model/${id}`);
};
import axios from "axios";
import API from "./api";

export const trainModel = async (data) => {
    const res = await axios.post(`${API}/train_model`, data);
    return res.data;
};

export const getTrainingHistory = async () => {
    const res = await axios.get(`${API}/training_history`);
    return res.data;
};
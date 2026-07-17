import axios from "axios";
import API from "./api";

export const predict = async (data) => {
    const res = await axios.post(`${API}/predict`, data);
    return res.data;
};
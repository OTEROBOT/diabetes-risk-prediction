import axios from "axios";

const API = "http://127.0.0.1:5000";

export async function getPredictionHistory() {

    const response = await axios.get(
        `${API}/prediction_history`
    );

    return response.data;
}
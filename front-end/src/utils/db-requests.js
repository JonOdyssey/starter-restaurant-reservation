import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export async function createReservationRequest(newReservation) {
  return await axios.post(`${API_BASE_URL}/reservations`, newReservation);
}

import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

export async function createReservationRequest(newReservation) {
  return await axios.post(`${API_BASE_URL}/reservations`, newReservation);
}

export async function deleteReservationRequest(reservation_id) {
  return await axios
    .put(`${API_BASE_URL}/reservations/${reservation_id}/status`, {
      data: { status: "cancelled" },
    })
    .then((response) =>
      response.status === 200 ? window.location.reload() : null
    )
    .catch(console.error);
}

export async function createTableRequest(newTable) {
  return await axios.post(`${API_BASE_URL}/tables`, newTable);
}

export async function updateTableRequest(table_id, reservation_id) {
  return await axios.put(
    `${API_BASE_URL}/tables/${table_id}/seat`,
    reservation_id
  );
}

export async function readReservationRequest(reservation_id) {
  return await axios.get(`${API_BASE_URL}/reservations/${reservation_id}`);
}

export async function updateTableStatusToFinished(table_id) {
  return await axios
    .delete(`${API_BASE_URL}/tables/${table_id}/seat`)
    .then((response) =>
      response.status === 200 ? window.location.reload() : null
    )
    .catch(console.error);
}

export async function updateReservationRequest(reservation_id, updatedData) {
  return await axios.put(`${API_BASE_URL}/reservations/${reservation_id}`, updatedData);
}

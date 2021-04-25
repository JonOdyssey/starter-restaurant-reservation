import React from "react";
import { Link } from "react-router-dom";
import { deleteReservationRequest } from "../utils/db-requests";
import {
  formatMobileNumber,
  formatTime,
} from "../utils/format-to-readable-data";
import "../layout/Layout.css";
/**
 * Reservation Card Component
 * @param reservation
 * Reservation object containing reservation information
 * @returns {JSX.Element}
 */

export default function ReservationCard({ reservation }) {
  const handleCancel = (e) => {
    e.preventDefault();
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      deleteReservationRequest(reservation.reservation_id);
    }
  };

  return (
    <div className="col-lg-3 col-sm-6 col-md-6">
      <div className="card border-dark mb-3">
        <h5 className="card-header">
          {reservation.first_name} {reservation.last_name}
        </h5>
        <div className="card-body">
          <p>Number of Guests: {reservation.people}</p>
          <p>Reservation Time: {formatTime(reservation.reservation_time)}</p>
          <p>Mobile Number: {formatMobileNumber(reservation.mobile_number)}</p>
          <p data-reservation-id-status={reservation.reservation_id}>
            Status: {reservation.status}
          </p>
        </div>
        {reservation.status === "booked" ? (
          <div className="card-footer">
            <div className="flex-container">
              <div className="justify-content-center">
                <Link
                  to={`/reservations/${reservation.reservation_id}/seat`}
                  className="btn submit-btn m-1 col-sm"
                >
                  <div>
                    <i class="bi bi-check-circle"></i>
                    &nbsp;Seat
                  </div>
                </Link>
                <Link
                  to={`/reservations/${reservation.reservation_id}/edit`}
                  className="btn edit-btn m-1 col-sm"
                >
                  <div>
                    <i class="bi bi-pencil-square" />
                    &nbsp;Edit
                  </div>
                </Link>
                <button
                  onClick={handleCancel}
                  className="btn delete-btn m-1 col-sm"
                  data-reservation-id-cancel={reservation.reservation_id}
                >
                  <div>
                    <i class="bi bi-x-circle-fill" />
                    &nbsp;Cancel
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

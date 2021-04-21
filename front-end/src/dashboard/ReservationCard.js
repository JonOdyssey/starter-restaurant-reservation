import React from "react";
import { Link } from "react-router-dom";
import { deleteReservationRequest } from "../utils/db-requests";

/**
 * Reservation Card Component
 * @param reservation
 * Reservation object containing reservation information
 * @returns {JSX.Element}
 */

export default function ReservationCard({ reservation }) {
  const handleCancel = (e) => {
    e.preventDefault();
    if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
      deleteReservationRequest(reservation.reservation_id);
    }
  };

  return (
    <>
      <div className="card">
        <h5>
          {reservation.first_name} {reservation.last_name}
        </h5>
        <p>{reservation.people}</p>
        <p>{reservation.reservation_time}</p>
        <p>{reservation.mobile_number}</p>
        <p data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </p>
        {reservation.status === "booked" ? (
          <div className="row">
            <Link
              to={`/reservations/${reservation.reservation_id}/seat`}
              className="sfButton"
            >
              <span className="oi oi-arrow-circle-bottom" />
              &nbsp; Seat
            </Link>
            <Link
              to={`/reservations/${reservation.reservation_id}/edit`}
              className="button p-1 px-2 "
            >
              <span className="oi oi-pencil" />
              &nbsp; Edit
            </Link>
            <button
              onClick={handleCancel}
              className="cancelButton"
              data-reservation-id-cancel={reservation.reservation_id}
            >
              <span className="oi oi-x" />
              &nbsp; Cancel
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

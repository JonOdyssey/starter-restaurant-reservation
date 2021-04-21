import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { readReservationRequest } from "../utils/db-requests";
import ReservationForm from "./ReservationForm";

export default function EditReservation() {
  const { reservation_id } = useParams();

  const [foundReservation, setFoundReservation] = useState({});
  const [reservationError, setReservationError] = useState(null);

  useEffect(findReservation, [reservation_id]);

  function findReservation() {
    const abortController = new AbortController();
    setReservationError(null);

    readReservationRequest(reservation_id)
      .then((response) =>
        setFoundReservation({
          ...response.data.data,
          reservation_date: response.data.data.reservation_date.slice(0, 10),
        })
      )
      .catch((err) => {
        setReservationError({
          status: err.response.status,
          message: err.respone.data.error,
        });
      });

    return () => abortController.abort();
  }

  return (
    <>
      <div>
        <h2> Edit Reservation</h2>
        <ReservationForm
          type="edit"
          reservationUpdate={foundReservation}
          reservation_id={reservation_id}
        />
        <ErrorAlert error={reservationError} />
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import useQuery from "../utils/useQuery";
import { previous, next } from "../utils/date-time";
import ReservationCard from "./ReservationCard";
import ErrorAlert from "../layout/ErrorAlert";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard(props) {
  const query = useQuery();

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [date, setDate] = useState(query.get("date") || props.date);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date} </h4>
        <button onClick={() => setDate(previous(date))}>Yesterday</button>
        <button onClick={() => setDate(next(date))}>Tomorrow</button>
        <button onClick={() => setDate(props.date)}>Today</button>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.map((reservation, index) => (
        <ReservationCard reservation={reservation} key={index} />
      ))}
    </main>
  );
}

export default Dashboard;

import React, { useEffect, useState } from "react";
import { listReservations, listTablesRequest } from "../utils/api";
import useQuery from "../utils/useQuery";
import { previous, next } from "../utils/date-time";
import ReservationCard from "./ReservationCard";
import TableCard from "./TableCard";
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
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTablesRequest(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
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
      <div>
        <h3>Tables</h3>
        {tables.map((table, index) => (
          <TableCard table={table} key={index} />
        ))}
      </div>
      <div>
        {reservations.length === 0 ? (
          <h3>No Reservations today!</h3>
        ) : (
          <h3>Reservations</h3>
        )}
        {reservations.map((reservation, index) => (
          <ReservationCard reservation={reservation} key={index} />
        ))}
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
    </main>
  );
}

export default Dashboard;

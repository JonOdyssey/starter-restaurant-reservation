import React, { useEffect, useState } from "react";
import { listReservations, listTablesRequest } from "../utils/api";
import useQuery from "../utils/useQuery";
import { previous, next } from "../utils/date-time";
import ReservationCard from "../reservations/ReservationCard";
import TableCard from "../tables/TableCard";
import ErrorAlert from "../layout/ErrorAlert";
import { formatDate } from "../utils/format-to-readable-data";

import "../layout/Layout.css";
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
      <div>
        <div className="mb-3">
          <h1 className="display-3">Dashboard</h1>
          <h4 className=" display-4 mb-0">
            Reservations for date: <u>{formatDate(date)}</u>
          </h4>
        </div>
      </div>
      <div className="mb-3 row container">
        <button className="date-button" onClick={() => setDate(previous(date))}>
          <span className="yesterday">&nbsp;Yesterday</span>
        </button>
        <button
          className="mx-2 date-button"
          onClick={() => setDate(props.date)}
        >
          <span className="today">Today&nbsp;</span>
        </button>
        <button className="date-button" onClick={() => setDate(next(date))}>
          <span className="tomorrow">Tomorrow&nbsp;</span>
        </button>
      </div>
      <div>
        {reservations.length === 0 ? (
          <h3 className="display-4">No Reservations today!</h3>
        ) : (
          <h3 className="display-4">Reservations</h3>
        )}
        <div className="row">
          {reservations.map((reservation, index) => (
            <ReservationCard reservation={reservation} key={index} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="display-4">Tables</h3>
        <div className="row">
          {tables.map((table, index) => (
            <TableCard table={table} key={index} />
          ))}
        </div>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
    </main>
  );
}

export default Dashboard;

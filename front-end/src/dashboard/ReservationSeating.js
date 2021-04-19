import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCard from "./ReservationCard";
import { listTablesRequest } from "../utils/api";
import {
  updateTableRequest,
  readReservationRequest,
} from "../utils/db-requests";

export default function ReservationSeating() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [tableId, setTableId] = useState(0);
  const [tablesData, setTablesData] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [reservationData, setReservationData] = useState([]);
  const [reservationError, setReservationError] = useState(null);

  useEffect(loadDashboard, [reservation_id]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationError(null);
    setTablesError(null);

    readReservationRequest(reservation_id)
      .then(setReservationData)
      .catch((err) =>
        setReservationError({
          status: err.response.status,
          message: err.response.data.error,
        })
      );

    listTablesRequest(abortController.signal)
      .then(setTablesData)
      .catch((err) =>
        setTablesError({
          status: err.response.status,
          message: err.response.data.error,
        })
      );

    return () => abortController.abort();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTableRequest(tableId, { data: { reservation_id } });
      history.push("/dashboard");
    } catch (err) {
      setTablesError({
        status: err.response.status,
        message: err.response.data.error,
      });
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setTableId(e.target.value);
  };

  const handleCancel = () => {
    setTableId("");
    history.goBack();
  };

  return (
    <>
      <div>
        {reservationData.reservation_time}
        <ReservationCard reservation={reservationData} />
        <form onSubmit={handleSubmit} className="row">
          <div>
            <label htmlFor="table_id">
              Select a table to sit guests:
              <select
                id="table_id"
                name="table_id"
                onChange={handleChange}
                value={tableId}
              >
                <option>-- Select table --</option>
                {tablesData.map((table) => {
                  const { table_id, table_name, capacity } = table;
                  return (
                    <option key={table_id} value={table_id}>
                      {`${table_name} - ${capacity}`}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
          <div>
            <button type="submit" className="btn">
              Submit
            </button>
            <button onClick={handleCancel} className="btn">
              Cancel
            </button>
          </div>
        </form>
        <ErrorAlert error={tablesError} />
        <ErrorAlert error={reservationError} />
      </div>
    </>
  );
}

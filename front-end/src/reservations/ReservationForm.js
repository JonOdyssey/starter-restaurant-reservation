import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  createReservationRequest,
  updateReservationRequest,
} from "../utils/db-requests";
import ErrorAlert from "../layout/ErrorAlert";

export default function ReservationForm({
  type,
  reservationUpdate,
  reservation_id,
}) {
  const history = useHistory();
  const [reservationError, setReservationError] = useState(null);

  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [reservationData, setReservationData] = useState({ ...initialState });

  useEffect(loadDashboard, [type, reservationUpdate]);

  function loadDashboard() {
    if (type === "edit") {
      const abortController = new AbortController();
      setReservationError(null);
      setReservationData(reservationUpdate);

      return () => abortController.abort();
    }
    return;
  }

  const handleChange = (e) => {
    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;

    setReservationData({
      ...reservationData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === "edit") {
        await updateReservationRequest(reservation_id, {
          data: reservationData,
        });
      } else {
        await createReservationRequest({ data: reservationData });
      }

      history.push(`/dashboard?date=${reservationData.reservation_date}`);
      setReservationData({ ...initialState });
    } catch (err) {
      setReservationError({
        status: err.response.status,
        message: err.response.data.error,
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    history.goBack();
  };

  return (
    <>
      {!type ? <h2 className="display-4">Create New Reservation</h2> : null}
      <ErrorAlert error={reservationError} />
      <form onSubmit={handleSubmit}>
        <div className="col">
          <div className="row">
            <label htmlFor="first_name" className="col-lg-3 mr-3 form-text">
              First Name:
              <input
                name="first_name"
                onChange={handleChange}
                className="form-control"
                placeholder="Enter first name"
                defaultValue={reservationData.first_name}
                required={true}
              />
            </label>
            <label htmlFor="last_name" className="col-lg-3 form-text">
              Last Name:
              <input
                name="last_name"
                onChange={handleChange}
                className="form-control"
                placeholder="Enter last name"
                defaultValue={reservationData.last_name}
                required={true}
              />
            </label>
          </div>
          <div className="row">
            <label htmlFor="mobile_number" className="col-lg-3 form-text">
              Mobile Number:
              <input
                name="mobile_number"
                type="tel"
                onChange={handleChange}
                className="form-control"
                placeholder="xxx-xxx-xxxx"
                defaultValue={reservationData.mobile_number}
                required={true}
              />
            </label>
          </div>
          <div className="row">
            <label
              htmlFor="reservation_date"
              className="col-lg-3 mr-1 form-text"
            >
              Select a reservation date:
              <input
                name="reservation_date"
                type="date"
                onChange={handleChange}
                className="form-control"
                placeholder="yyyy-mm-dd"
                pattern="\d{4}-\d{2}-\d{2}"
                defaultValue={reservationData.reservation_date}
                required={true}
              />
            </label>
            <label htmlFor="reservation_time" className="col-lg-3 form-text">
              Select a reservation time:
              <input
                name="reservation_time"
                type="time"
                onChange={handleChange}
                className="form-control"
                placeholder="hh:mm"
                pattern="[0-9]{2}:[0-9]{2}"
                defaultValue={reservationData.reservation_time}
                required={true}
              />
            </label>
          </div>
          <div className="row">
            <label htmlFor="capacity" className="col-lg-3 form-text">
              How many guests?
              <input
                name="people"
                type="number"
                onChange={handleChange}
                min="1"
                className="form-control"
                defaultValue={reservationData.people}
                required={true}
              />
            </label>
          </div>
          <div className="row">
            <button type="submit" className="btn submit-btn m-2">
              <span className="submit-icon" />
              &nbsp;Submit
            </button>
            <button
              onClick={handleCancel}
              type="cancel"
              className="btn delete-btn m-2"
            >
              <span className="delete-icon" />
              &nbsp;Cancel
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

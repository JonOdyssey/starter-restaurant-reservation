import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCard from "./ReservationCard";

export default function Search() {
  const [mobile_number, setMobileNumber] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const handleChange = (e) => setMobileNumber(e.target.value);

  const handleFind = (e) => {
    e.preventDefault();

    const abortController = new AbortController();
    setSearchError(null);
    listReservations({ mobile_number }, abortController.signal)
      .then(setSearchResults)
      .then(() =>
        searchResults.length !== 0
          ? null
          : setSearchError({ status: 404, message: "No reservations found" })
      );
  };

  //   useEffect(loadDashboard, [mobile_number]);

  //   function loadDashboard() {
  //     const abortController = new AbortController();
  //     setSearchError(null);
  //     listReservations({ mobile_number }, abortController.signal)
  //       .then(setSearchResults)
  //       .then(() =>
  //         searchResults.length !== 0
  //           ? null
  //           : setSearchError({ status: 404, message: "No reservations found" })
  //       );

  //     return () => abortController.abort();
  //   }

  return (
    <>
      <h2>Search Reservation by Phone Number:</h2>
      <div>
        <form onSubmit={handleFind}>
          <div>
            <label>
              Enter Mobile Number:
              <input
                name="mobile_number"
                onChange={handleChange}
                required={true}
              />
            </label>
            <button type="submit" className="btn">
              Find
            </button>
          </div>
        </form>
        {searchResults.length === 0 ? (
          <ErrorAlert error={searchError} />
        ) : (
          <div>
            <h3>Reservations</h3>
            {searchResults.map((result, index) => {
              return <ReservationCard reservation={result} key={index} />;
            })}
          </div>
        )}
      </div>
    </>
  );
}

import React, { useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationCard from "../reservations/ReservationCard";

export default function Search() {
  const [mobile_number, setMobileNumber] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [displayResults, setDisplayResults] = useState("");

  const handleChange = (e) => setMobileNumber(e.target.value);

  const handleFind = (e) => {
    e.preventDefault();

    const abortController = new AbortController();
    setSearchError(null);
    setDisplayResults(mobile_number);
    listReservations({ mobile_number }, abortController.signal)
      .then(setSearchResults)
      .then(() =>
        searchResults.length !== 0
          ? null
          : setSearchError({ status: 404, message: "No reservations found" })
      );
  };

  return (
    <>
      <h2 className="display-4">Search Reservation by Phone Number:</h2>
      <div>
        <form onSubmit={handleFind}>
          <div className="col">
            <div className="row">
              <label htmlFor="mobile_number" className="col-lg-3 mr-3 form-text">
                Enter Mobile Number:&nbsp;
                <input
                  name="mobile_number"
                  onChange={handleChange}
                  className="form-control"
                  required={true}
                />
              </label>
            </div>
            <div className="row">
              <button type="submit" className="btn search-btn m-2">
                Find&nbsp;<i class="bi bi-eye"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
      <div>
        {searchResults.length === 0 ? (
          <ErrorAlert error={searchError} />
        ) : (
          <>
            <h3 className="display-4">
              Searching Reservations For <strong>{displayResults}</strong>
            </h3>
            <div className="row">
              {searchResults.map((result, index) => {
                return <ReservationCard reservation={result} key={index} />;
              })}
            </div>
          </>
        )}
      </div>
    </>
  );
}

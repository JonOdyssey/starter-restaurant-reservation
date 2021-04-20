import React from "react";
import { updateTableStatusToFinished } from "../utils/db-requests";

export default function TableCard({ table }) {
  const handleClick = async (e) => {
    e.preventDefault();

    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await updateTableStatusToFinished(table.table_id);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <div className="card">
        <div>
          <p>{table.table_name}</p>
          <p>{table.capacity}</p>
          {table.reservation_id ? (
            <div>
              <h6 data-table-id-status={table.table_id}>Occupied</h6>
              <button
                data-table-id-finish={table.table_id}
                type="finish"
                onClick={handleClick}
                className="sfButton"
              >
                Finish
              </button>
            </div>
          ) : (
            <h6 data-table-id-status={table.table_id}>Free</h6>
          )}
        </div>
      </div>
    </>
  );
}

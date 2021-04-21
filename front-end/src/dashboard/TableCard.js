import React from "react";
import { updateTableStatusToFinished } from "../utils/db-requests";

/**
 * Table Card Component
 * @param table
 * Table object containing table information
 * @returns {JSX.Element}
 */

export default function TableCard({ table }) {
  const handleFinish = (e) => {
    e.preventDefault();

    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      updateTableStatusToFinished(table.table_id);
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
                onClick={handleFinish}
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

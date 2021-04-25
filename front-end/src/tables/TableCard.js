import React from "react";
import { updateTableStatus } from "../utils/db-requests";

/**
 * Table Card Component
 * @param table
 * Table object containing table information
 * @returns {JSX.Element}
 */

export default function TableCard({ table }) {
  const handleFinish = async (e) => {
    e.preventDefault();

    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      const response = await updateTableStatus(table.table_id);
      if (response.status === 200) window.location.reload();
    }
  };

  return (
    <div className="col-lg-2 col-sm-6 col-md-6">
      <div className="card border-dark mb-3">
        <h5 className="card-header">Location: {table.table_name}</h5>
        <div className="card-body">
          <p>Max capacity: {table.capacity}</p>
          {!table.reservation_id ? (
            <p data-table-id-status={table.table_id}>Status: free</p>
          ) : (
            <p data-table-id-status={table.table_id}>Status: occupied</p>
          )}
        </div>
        {table.reservation_id ? (
          <div className="card-footer">
            <button
              data-table-id-finish={table.table_id}
              onClick={handleFinish}
              className="btn finish-btn"
            >
              <i class="bi bi-hand-thumbs-up-fill"></i>
              &nbsp;Finish
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

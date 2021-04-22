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
    <div className="card">
      <div className="card-body">
        <p>{table.table_name}</p>
        <p>{table.capacity}</p>
        {!table.reservation_id ? (
          <p data-table-id-status={table.table_id}>free</p>
        ) : (
          <p data-table-id-status={table.table_id}>occupied</p>
        )}
        {table.reservation_id ? (
          <button
            data-table-id-finish={table.table_id}
            onClick={handleFinish}
            className="sfButton"
          >
            Finish
          </button>
        ) : null}
      </div>
    </div>
  );
}

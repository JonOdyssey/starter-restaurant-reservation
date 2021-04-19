import React from "react";

export default function TableCard({ table }) {
  return (
    <>
      <div>
        <div>
          <p>{table.table_name}</p>
          <p>{table.capacity}</p>
        </div>
        {table.occupied ? (
          <div>
            <p>occupied</p>
            <button className="sfButton">Finish</button>
          </div>
        ) : (
          <div>
            <p>free</p>
          </div>
        )}
      </div>
    </>
  );
}

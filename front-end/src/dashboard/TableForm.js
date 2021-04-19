import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTableRequest } from "../utils/db-requests";
import ErrorAlert from "../layout/ErrorAlert";

export default function TableForm() {
  const history = useHistory();
  const [tableError, setTableError] = useState(null);

  const initialState = {
    table_name: "",
    capacity: 0,
  };
  const [tableData, setTableData] = useState({ ...initialState });

  const handleChange = (e) => {
    e.preventDefault();

    const value =
      e.target.type === "number" ? Number(e.target.value) : e.target.value;

    setTableData({
      ...tableData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTableRequest({ data: tableData });

      setTableData({ ...initialState });
      history.push(`/dashboard`);
    } catch (err) {
      setTableError({
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
      <div>
        <h2>Create a new table:</h2>
        <form className="row" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="table_name">
              Table Name:
              <input
                name="table_name"
                id="table_name"
                type="text"
                onChange={handleChange}
                className="form-control"
                placeholder="Enter table name"
                value={tableData.table_name}
                required={true}
              />
            </label>
          </div>
          <div className="form-group">
            <label htmlFor="capacity">
              Table Capacity:
              <input
                name="capacity"
                id="capacity"
                type="number"
                onChange={handleChange}
                className="form-control"
                value={tableData.capacity}
                required={true}
              />
            </label>
          </div>
          <div>
            <button onClick={handleCancel} type="cancel" className="btn">
              Cancel
            </button>
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </form>
        <ErrorAlert error={tableError} />
      </div>
    </>
  );
}

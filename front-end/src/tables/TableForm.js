import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTableRequest } from "../utils/db-requests";
import ErrorAlert from "../layout/ErrorAlert";

export default function TableForm() {
  const history = useHistory();
  const [tableError, setTableError] = useState(null);

  const initialState = {
    table_name: "",
    capacity: 1,
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
      <h2 className="display-4">Create New Table:</h2>
      <ErrorAlert error={tableError} />
      <form onSubmit={handleSubmit}>
        <div className="col">
          <div className="row">
            <label htmlFor="table_name" className="col-lg-3 mr-3 form-text">
              Table Name:
              <input
                name="table_name"
                id="table_name"
                type="text"
                onChange={handleChange}
                className="form-control"
                placeholder="Enter table name"
                defaultValue={tableData.table_name}
                required={true}
              />
            </label>
          </div>
          <div className="row">
            <label htmlFor="capacity" className="col-lg-3 mr-3 form-text">
              Table Capacity:
              <input
                name="capacity"
                id="capacity"
                type="number"
                onChange={handleChange}
                min="1"
                className="form-control"
                defaultValue={tableData.capacity}
                required={true}
              />
            </label>
          </div>
          <div className="row">
            <button type="submit" className="btn submit-btn m-2">
              <span className="submit-icon" />
              &nbsp;Submit
            </button>
            <button onClick={handleCancel} type="cancel" className="btn delete-btn m-2">
              <span className="delete-icon" />
              &nbsp;Cancel
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import ReservationForm from "../dashboard/ReservationForm";
import TableForm from "../dashboard/TableForm";
import ReservationSeating from "../dashboard/ReservationSeating";
import Search from "../dashboard/Search";
import EditReservation from "../dashboard/EditReservation";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route path="/reservations/new">
        <ReservationForm />
      </Route>
      <Route exact={true} path="/tables/new">
        <TableForm />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/seat">
        <ReservationSeating />
      </Route>
      <Route exact={true} path="/search">
        <Search />
      </Route>
      <Route exact={true} path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;

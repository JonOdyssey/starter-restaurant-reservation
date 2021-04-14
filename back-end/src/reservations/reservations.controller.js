/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundry = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  const date = req.query.date;
  const reservations = !date ? await service.list() : await service.list(date);

  res.json({ data: reservations });
}

function hasFirstNameProperty(req, res, next) {
  const { data: { first_name } = {} } = req.body;
  if (!first_name) {
    next({
      status: 400,
      message: "first_name REQUIRED for your reservation!",
    });
  }

  next();
}

function hasLastNameProperty(req, res, next) {
  const { data: { last_name } = {} } = req.body;
  if (!last_name) {
    next({
      status: 400,
      message: "last_name REQUIRED for your reservation!",
    });
  }

  next();
}

function hasValidReservationDateProperty(req, res, next) {
  const { data: { reservation_date } = {} } = req.body;
  const reservationDate = new Date(reservation_date);
  const today = new Date();

  if (!reservation_date || !reservation_date.match(/\d{4}-\d{2}-\d{2}/g)) {
    next({
      status: 400,
      message: "reservation_date REQUIRED for your reservation!",
    });
  }

  if (reservationDate.getUTCDay() === 2)
    next({ status: 400, message: "We're closed on Tuesdays!" });

  if (reservationDate < today)
    next({ status: 400, message: "Reservation must be in the future!" });

  next();
}

function hasValidReservationTimeProperty(req, res, next) {
  const { data: { reservation_time } = {} } = req.body;
  if (!reservation_time || !reservation_time.match(/[0-9]{2}:[0-9]{2}/g)) {
    next({
      status: 400,
      message: "reservation_time REQUIRED for your reservation!",
    });
  }

  const reservationHour = Number(reservation_time[0] + reservation_time[1]);
  const reservationMinutes = Number(reservation_time[3] + reservation_time[4]);
  //restaurant hours from 10:30 am - 10:30 pm, last available time to reserve is 9:30 pm
  if (
    reservationHour < 10 ||
    (reservationHour === 10 && reservationMinutes < 30)
  )
    next({ status: 400, message: "Restaurant opens at 10:30 AM" });

  if (
    reservationHour > 21 ||
    (reservationHour === 21 && reservationMinutes > 30)
  )
    next({
      status: 400,
      message: "Restaurant closes at 10:30 PM. Reservations close at 9:30 PM",
    });

  next();
}

function hasMobileNumberProperty(req, res, next) {
  const { data: { mobile_number } = {} } = req.body;
  if (!mobile_number) {
    next({
      status: 400,
      message: "mobile_number REQUIRED for your reservation!",
    });
  }

  next();
}

function hasPeopleProperty(req, res, next) {
  const { data: { people } = {} } = req.body;
  if (typeof people !== "number" || people <= 0) {
    next({
      status: 400,
      message: "Please enter a valid number of people for your reservation!",
    });
  }

  next();
}

async function create(req, res, next) {
  const { data } = req.body;
  const newReservation = await service.create(data);

  res.status(201).json({ data: newReservation[0] });
}

module.exports = {
  list: [asyncErrorBoundry(list)],
  create: [
    hasFirstNameProperty,
    hasLastNameProperty,
    hasValidReservationDateProperty,
    hasValidReservationTimeProperty,
    hasMobileNumberProperty,
    hasPeopleProperty,
    asyncErrorBoundry(create),
  ],
};

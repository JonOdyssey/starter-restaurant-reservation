const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  res.json({ data: await service.list() });
}

function hasTableNameProperty(req, res, next) {
  const { data: { table_name } = {} } = req.body;
  if (!table_name || table_name === "") {
    next({
      status: 400,
      message: "table_name is REQUIRED",
    });
  }

  if (table_name.length < 2) {
    next({
      status: 400,
      message: "table_name must be 2 characters or longer",
    });
  }

  next();
}

function hasCapacityProperty(req, res, next) {
  const { data: { capacity } = {} } = req.body;

  if (!capacity || typeof capacity !== "number") {
    next({
      status: 400,
      message: "Please enter a number for the table's capacity",
    });
  }

  if (capacity < 1) {
    next({ status: 400, message: "Please enter a number greater than 0" });
  }

  next();
}

async function create(req, res, next) {
  const { data } = req.body;
  const newTable = await service.create(data);
  res.status(201).json({ data: newTable[0] });
}

async function validateTableId(req, res, next) {
  const { table_id } = req.params;
  const foundTable = await service.read(table_id);

  if (!foundTable) {
    next({
      status: 404,
      message: `${table_id} not found!`,
    });
  } else {
    res.locals.table = foundTable;
    next();
  }
}

async function read(req, res, next) {
  res.json({ data: res.locals.table });
}

async function validateReservationToUpdate(req, res, next) {
  if (!req.body.data) next({ status: 400, message: "Data missing!" });

  const { reservation_id } = req.body.data;
  if (!reservation_id)
    next({ status: 400, message: "reservation_id missing!" });

  const reservationToUpdate = await reservationService.read(reservation_id);
  if (!reservationToUpdate)
    next({ status: 404, message: `${reservation_id} does not exist!` });
  if (reservationToUpdate.status === "seated")
    next({ status: 400, message: "Table already seated" });

  res.locals.reservation = reservationToUpdate;
  next();
}

async function validateUpdatedCapacity(req, res, next) {
  const { table_id } = req.params;
  const foundTable = await service.read(table_id);
  const reservationToUpdate = res.locals.reservation;

  if (foundTable.capacity < reservationToUpdate.people) {
    return next({
      status: 400,
      message: `${foundTable.name} cannot seat the new capacity of ${reservationToUpdate.people}`,
    });
  }

  if (foundTable.occupied === true) {
    return next({
      status: 400,
      message: `${foundTable.table_name} is currently occupied.`,
    });
  }

  next();
}

async function update(req, res, next) {
  const { table_id } = req.params;
  const { reservation_id } = res.locals.reservation;
  const updatedTable = await service.update(table_id, reservation_id);
  await reservationService.updateStatus(reservation_id, "seated");

  res.status(200).json({ data: updatedTable });
}

async function destroy(req, res, next) {
  const foundTable = res.locals.table;

  if (!foundTable.occupied) next({ status: 400, message: `${foundTable.table_name} is not occupied.`});

  const deletedTable = await service.destroy(foundTable.table_id);
  await reservationService.updateStatus(foundTable.reservation_id, "finished");

  res.status(200).json({ data: deletedTable });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasTableNameProperty,
    hasCapacityProperty,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(validateTableId), read],
  update: [
    asyncErrorBoundary(validateReservationToUpdate),
    asyncErrorBoundary(validateUpdatedCapacity),
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(validateTableId), asyncErrorBoundary(destroy)],
};

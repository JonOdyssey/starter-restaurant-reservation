const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");

const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
  res.json({ data: await service.list() });
}

async function validateNew(req, res, next) {
  if (!req.body.data) return next({ status: 400, message: "Data Missing! :(" });
  const { table_name, capacity, reservation_id } = req.body.data;

  if (
    !table_name ||
    table_name === "" ||
    table_name.length === 1 ||
    table_name.replace(/\s/g, "").length === 0
  ) {
    next({
      status: 400,
      message: "Invalid table_name: Must be 2 characters or longer",
    });
  }

  if (!capacity || capacity === 0 || typeof capacity !== "number") {
    next({
      status: 400,
      message: "Invalid capacity: Please enter a number greater than 0",
    });
  }

  if (reservation_id) {
    res.locals.newTable = {
      table_name: table_name,
      capacity: capacity,
      reservation_id: reservation_id,
      occupied: true,
    };
  } else {
    res.locals.newTable = { table_name: table_name, capacity: capacity };
  }

  next();
}

async function create(req, res, next) {
  const newTable = await service.create(res.locals.newTable);
  res.status(201).json({ data: newTable[0] });
}

async function validateTableId(req, res, next) {
  const { table_id } = req.params;
  const foundTable = await service.read(table_id);

  if (!foundTable) next({ status: 404, message: `${table_id} not found!` });

  res.locals.table = foundTable;
  next();
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
  if (!reservationToUpdate) next({ status: 404, message: `${reservation_id} does not exist!` });
  if (reservationToUpdate.status === "seated") next({ status: 400, message: "Table already seated" });

  res.locals.reservation = reservationToUpdate;
  next();
}

async function validateUpdatedCapacity(req, res, next) {
  const { table_id } = req.params;
  const foundTable = await service.read(table_id);
  const reservationToUpdate = res.locals.reservation;

  if (foundTable.capacity < reservationToUpdate.people) next({ status: 400, message: `${foundTable.name} cannot seat the new capacity of ${reservationToUpdate.people}` });

  if (foundTable.occupied === true) next({ status: 400, message: `${foundTable.table_name} is currently occupied.` });

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

  if (!foundTable.occupied) next({ status: 400, message: `${foundTable.table_name} is not occupied.` });

  const deletedTable = await service.destroy(foundTable.table_id);
  await reservationService.updateStatus(foundTable.reservation_id, "finished");

  res.status(200).json({ data: deletedTable });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    asyncErrorBoundary(validateNew),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(validateTableId), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(validateReservationToUpdate),
    asyncErrorBoundary(validateUpdatedCapacity),
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(validateTableId), asyncErrorBoundary(destroy)],
};

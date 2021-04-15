const knex = require("../db/connection");

const list = (date) => {
  return !date
    ? knex("reservations as r").select("*").orderBy("reservation_time")
    : knex("reservations as r")
        .select("*")
        .where({ "r.reservation_date": date })
        .orderBy("reservation_time");
};

const create = (data) => {
  return knex("reservations").insert(data).returning("*");
};

const read = (reservation_id) => {
  return knex("reservations")
    .select("*")
    .where("reservation_id", reservation_id)
    .first();
};

const update = () => {};

const updateStatus = (reservation_id, status) =>
    knex('reservations').where('reservation_id', reservation_id).update({ status: status }).returning('status');

module.exports = {
  list,
  create,
  read,
  update,
  updateStatus,
};

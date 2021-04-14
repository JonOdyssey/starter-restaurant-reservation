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

module.exports = {
  list,
  create,
};

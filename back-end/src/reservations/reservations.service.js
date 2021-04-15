const knex = require("../db/connection");

const list = (date) => knex("reservations as r").select("*").whereNot("status", "finished").where({ "r.reservation_date": date }).orderBy("reservation_time");


const listByMobileNumber = (mobile_number) => knex("reservations").whereRaw("translate(mobile_number, '() -', '') like ?", `%${mobile_number.replace(/\D/g, "")}%`).orderBy("reservation_date");

const create = (data) => knex("reservations").insert(data).returning("*");

const read = (reservation_id) => knex("reservations").select("*").where("reservation_id", reservation_id).first();

const update = (reservation_id, updatedReservationInfo) => {
  return knex("reservations").where("reservation_id", reservation_id).update(updatedReservationInfo).returning(["first_name", "last_name", "mobile_number", "people", "reservation_date", "reservation_time"]);
};

const updateStatus = (reservation_id, status) => knex("reservations").where("reservation_id", reservation_id).update({ status: status }).returning("status");

module.exports = {
  list,
  listByMobileNumber,
  create,
  read,
  update,
  updateStatus,
};

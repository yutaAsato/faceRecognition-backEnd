const express = require("express");

const bcrypt = require("bcrypt-nodejs");

//connects this server to psql databse
const knex = require("knex");

//for heroku----------
// const db = knex({
//   client: "pg",
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   },
// });

//for local----------
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "oblivion",
    database: "facerecognition",
  },
});

module.exports = { db, knex, bcrypt, express };

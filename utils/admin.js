const express = require("express");

const bcrypt = require("bcrypt-nodejs");

const Pool = require("pg").Pool;

const pool = new Pool({
  host: "127.0.0.1",
  user: "postgres",
  password: "oblivion",
  port: 5432,
  database: "faceRecognition",
});

//connects this server to psql databse
const knex = require("knex");

//============================================
// for heroku----------
// const db = knex({
//   client: "pg",
//   connection: {
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//       rejectUnauthorized: false,
//     },
//   },
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//==========================================

//for local----------
// const db = knex({
//   client: "pg",
//   connection: {
//     host: "127.0.0.1",
//     user: "postgres",
//     password: "oblivion",
//     database: "faceRecognition",
//   },
// });

module.exports = { db, knex, bcrypt, express, pool };

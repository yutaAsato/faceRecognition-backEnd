const express = require("express");

const bcrypt = require("bcrypt-nodejs");
const knex = require("knex");

const Pool = require("pg").Pool;

let pool;
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  pool = new Pool({
    host: "127.0.0.1",
    user: "postgres",
    password: "oblivion",
    port: 5432,
    database: "faceRecognition",
  });
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      required: true,
      rejectUnauthorized: false,
    },
    sslmode: "require",
  });
}

module.exports = { knex, bcrypt, express, pool };

const { knex, db, bcrypt } = require("./utils/admin");
const express = require("express");

const verifyJWT = require("./utils/verifyJWT");

const cors = require("cors");
const app = require("express")();
//---------importing from controllers folder--------

const {
  handleSignin,
  handleRegister,
  handleProfileId,
  handleImage,
  handleApi,
  handleGetUser,
} = require("./controllers/controllers");

//-----middleware--

app.use(express.json());

app.use(cors());

//-----------

app.get("/", (req, res) => {
  res.send("it is working!");
});

app.get("/getUser", verifyJWT, handleGetUser);
app.post("/signin", handleSignin);
app.post("/register", handleRegister);
app.get("/profile/:id", handleProfileId);

//increments count
app.put("/image", handleImage);
//handleAPI (Clarifai)
app.post("/imageurl", handleApi);

//-------LISTEN--------

// for heroku------
app.listen(process.env.PORT || 3000, () => {
  console.log(`running on ${process.env.PORT}`);
});

/*
/--> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image(entriesupdate) --> PUT  = user
*/

//=======DEV ONLY===============================================================================
//query postgres database here with nodemon(no deploy, testing only)================
// db.select("*")
//   .from("users")
//   .where({ id: 2 })
//   .then((res) => console.log(res));

const { knex, db, bcrypt } = require("./utils/admin");
const express = require("express");

const cors = require("cors");
const app = require("express")();
//---------importing from controllers folder--------

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profileId = require("./controllers/profileId");
const image = require("./controllers/image");

const {
  handleSignin,
  handleRegister,
  handleProfileId,
  handleImage,
  handleApi,
} = require("./controllers/controllers");

//------------------

//-----middleware--

app.use(express.json());

app.use(cors());

//-----------

app.get("/", (req, res) => {
  res.send("it is working!");
});

//singin
app.post("/signin", handleSignin);

//register
app.post("/register", handleRegister);

//profileId
app.get("/profile/:id", handleProfileId);

//image(update entries)
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
db.select("*")
  .from("users")
  .where({ id: 2 })
  .then((res) => console.log(res));

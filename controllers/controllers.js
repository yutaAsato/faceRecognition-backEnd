const { knex, db, bcrypt } = require("../utils/admin");
//---------------------------------------------------------------------
//api call to CLARIFAI
const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "040ad2b7710f4f9883c3f96bac5dab05",
});

exports.handleApi = (req, res) => {
  app.models
    .initModel({ id: Clarifai.FACE_DETECT_MODEL })
    .then((generalModel) => generalModel.predict(req.body.input))
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("unable to respond with API"));
};

//handleImage
exports.handleImage = (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => {
      res.json(entries[0]);
    })

    .catch((err) => res.status(404).json("unable to get entries"));
};

//handleRegister
exports.handleRegister = (req, res) => {
  const { email, name, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json("invalid inputs");
  }
  const hash = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx
      .insert({ hash: hash, email: email })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(404).json("unable to register"));
};

//profileId
exports.handleProfileId = (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("users")
    .where({ id: id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.json("no such user, sorry!");
      }
    })

    .catch((err) => res.status(404).json("error fetching user"));
};

//handleSignin
exports.handleSignin = (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("invalid inputs");
  }
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      // console.log(data)
      const isValid = bcrypt.compareSync(password, data[0].hash);
      //    console.log(isValid)
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then((user) => {
            console.log(user);
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("unable to get user"));
      } else {
        res.status(400).json("wrong credentials,sorry!");
      }
    })

    .catch((err) => res.status(400).json("wrong credentials"));
};

// db.select("*")
//   .from("users")
//   .where({ id: 2 })
//   .then((res) => console.log(res));

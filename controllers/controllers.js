const { knex, db, bcrypt, pool } = require("../utils/admin");
const jwt = require("jsonwebtoken");
//---------------------------------------------------------------------
//api call to CLARIFAI
const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "040ad2b7710f4f9883c3f96bac5dab05",
});

// exports.handleApi = (req, res) => {
//   app.models
//     .initModel({ id: Clarifai.DEMOGRAPHICS_MODEL })
//     .then((generalModel) => generalModel.predict(req.body.input))
//     .then((data) => res.json(data))
//     .catch((err) => res.status(400).json(err));
// };

exports.handleApi = (req, res) => {
  app.workflow
    .predict("Demographics", req.body.input)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json(err));
};

//handleImage
exports.handleImage = async (req, res) => {
  try {
    const { id } = req.body;

    const entries = await pool.query(
      "update users set entries = entries + 1 where id = $1 returning *",
      [id]
    );

    res.json(entries.rows[0].entries);
  } catch (error) {
    console.log(error.message);
    res.status(404).json("unable to get entries");
  }
};

//handleRegister
exports.handleRegister = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json("invalid inputs");
    }
    const hash = bcrypt.hashSync(password);

    const loginTable = await pool.query(
      "insert into login (hash, email) values ($1, $2) returning email",
      [hash, email]
    );

    const userTable = await pool.query(
      "insert into users (email , name, joined) values ($1, $2, $3) returning *",
      [email, name, new Date()]
    );

    //create jwt and assign the login data to token.
    let token;
    if (userTable.rows[0]) {
      token = jwt.sign({ jwtUser: req.body }, "secretKey");
    }

    // console.log(token);
    res.json(token);
  } catch (error) {
    console.error(error.message);
    res.status(404).json("unable to register");
  }
};

//profileId
exports.handleProfileId = async (req, res) => {
  try {
    const { id } = req.params;
    const userProfile = await pool.query("select * from users where id = $1", [
      id,
    ]);

    res.json(userProfile.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
};

//handleSignin
exports.handleSignin = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("invalid inputs");
    }

    const loginInfo = await pool.query("select * from login where email = $1", [
      email,
    ]);

    const isValid = bcrypt.compareSync(password, loginInfo.rows[0].hash);

    //create jwt and assign the login data to token.
    let token;
    if (isValid) {
      token = jwt.sign({ jwtUser: req.body }, "secretKey");
    }

    res.json(token);
  } catch (error) {
    console.error(error.message);
    res.status(400).json("wrong credentials");
  }
};

//handleGetUser
exports.handleGetUser = async (req, res) => {
  try {
    //went through 'verifyJWT' middleware check, req.token holds the extracted token from header
    //'decoded' now holds the payload from token which includes the data assigned to token at login/signup.
    var decoded = jwt.verify(req.token, "secretKey");
    console.log(decoded.jwtUser);

    const { email, name, password } = decoded.jwtUser;

    if (!email || !password) {
      return res.status(400).json("invalid inputs");
    }

    const loginInfo = await pool.query("select * from login where email = $1", [
      email,
    ]);

    const isValid = bcrypt.compareSync(password, loginInfo.rows[0].hash);

    let verifiedUser;
    if (isValid) {
      verifiedUser = await pool.query("select * from users where email = $1", [
        email,
      ]);
    }

    res.json(verifiedUser.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(400).json("wrong credentials");
  }
};

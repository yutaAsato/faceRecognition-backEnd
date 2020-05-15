const express = require('express');
const app = express();

const bcrypt = require('bcrypt-nodejs')

const cors = require('cors')

//connects this server to psql databse
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
      host : 'postgresql-animated-42949',
      user : 'postgres',
      password : 'oblivion',
      database : 'facerecognition'
    }
  });

//---------importing from controllers folder--------

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profileId = require('./controllers/profileId')
const image = require('./controllers/image')

//------------------




//-----middleware--

app.use(express.json()); 

app.use(cors())

//-----------







app.get('/', (req, res) => {res.send("it is working!")})   


//singin
app.post('/signin', (req, res) => { signin.handleSignin (req, res, db, bcrypt)})
   

//register
app.post('/register',(req, res) => { register.handleRegister( req, res, db, bcrypt)})


//profileId
app.get('/profile/:id', (req, res) => { profileId.handleProfileId(req, res,db)})

   
//image(update entries)
app.put('/image',(req, res) => {image.handleImage(req,res, db)})

//handleAPI (Clarifai)
app.post('/imageurl',(req, res) => {image.handleApi(req,res,)})

 








//-------LISTEN--------
app.listen(process.env.PORT || 3000, () =>{
    console.log(`running on ${process.env.PORT}`)
})



/*
/--> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image(entriesupdate) --> PUT  = user
*/
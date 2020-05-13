const express = require('express');
const app = express();

const bcrypt = require('bcrypt-nodejs')

const cors = require('cors')

//connects this server to psql databse
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'oblivion',
      database : 'facerecognition'
    }
  });


// db.select('*').from ('users').then(data => {
//     console.log(data)
// })


//------------------




//-----middleware--

app.use(express.json()); 

app.use(cors())

//-----------







app.get('/', (req, res) => {
    res.send(database.users)
 })   


//singin
app.post('/signin', (req , res) => {

    db.select('email', 'hash').from ('login')
    .where('email', '=', req.body.email)
    .then( data => {
        // console.log(data)
       const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
    //    console.log(isValid)
        if (isValid){
          return db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    console.log(user)
                    res.json(user[0])
                }) 
                .catch(err => res.status(400).json('unable to get user'))
       }else{
        res.status(400).json('wrong credentials,sorry!')
       }
    })
    
    .catch(err => res.status(400).json('wrong credentials'))
})
   




//register
app.post('/register', (req ,res) => {
    const { email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({ hash: hash , email: email})
        .into('login')
        .returning ('email')
        .then(loginEmail => {
          return  trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            })
            .then(user =>{
                res.json(user[0]) 
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })

    .catch(err => res.status(404).json('unable to register'))
   
})

   

 
//profileId
app.get('/profile/:id', (req , res) => {
    const {id} = req.params;   

    db.select('*').from ('users').where({id: id})
    .then(user => {
        if (user.length){
            res.json(user[0])   
        }else{
            res.json('no such user, sorry!')
        }        
    })  

    .catch(err => res.status(404).json('error fetching user'))  
})  


//image(update entries)
app.put('/image', (req, res) => {
        const {id} = req.body;

        db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        }) 

        .catch(err => res.status(404).json('unable to get entries'))
})

//---------------


//-------LISTEN--------
app.listen(3000, () =>{
    console.log('running on 3000!')
})



/*
/--> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image(entriesupdate) --> PUT  = user
*/
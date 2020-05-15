

const handleSignin = (req, res, db, bcrypt) => {
    const { email, name, password} = req.body;

    if( !email || !password){
        return res.status(400).json('invalid inputs')
    }
    db.select('email', 'hash').from ('login')
    .where('email', '=', email)
    .then( data => {
        // console.log(data)
       const isValid = bcrypt.compareSync(password, data[0].hash);
    //    console.log(isValid)
        if (isValid){
          return db.select('*').from('users')
                .where('email', '=', email)
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
}



module.exports = {
    handleSignin: handleSignin
}



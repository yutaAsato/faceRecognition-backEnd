
const handleProfileId = (req , res, db) => {
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
} 

module.exports = {
    handleProfileId: handleProfileId

}
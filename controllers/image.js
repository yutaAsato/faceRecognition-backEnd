
const Clarifai = require('clarifai')

const app = new Clarifai.App({
    apiKey: '040ad2b7710f4f9883c3f96bac5dab05'
   });
   

const handleApi = (req , res) => {

    app.models.initModel({id: Clarifai.FACE_DETECT_MODEL})
   .then(generalModel => generalModel.predict(req.body.input))
    .then(data => res.json(data))   
    .catch(err => res.status(400).json('unable to respond with API'))
}
   



const handleImage = (req, res, db) => {
    const {id} = req.body;

    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    }) 

    .catch(err => res.status(404).json('unable to get entries'))
}


module.exports = {
    handleImage: handleImage,
    handleApi: handleApi
}
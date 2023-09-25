const QrTracking = require('../models/qr_tracking')
const User = require('../models/users')
const moment = require('moment')

const checkAuthenticate = require('../middleware/auth');

module.exports = function route(app){
    app.get('/users', checkAuthenticate , async (req, res) =>{
        const users = await User.find()
        res.render('pages/users/index', {users: users})
    })
   
    app.get('/users/:_id', checkAuthenticate , async(req, res) => {
        const { _id } = req.params 
        const user = await User.findOne({_id}).populate('trackings')
        const trackings = await QrTracking.find({user: _id}).sort({createdAt: -1})

        res.render('pages/users/show', {
            user,
            trackings,
            moment
        })
    })
}
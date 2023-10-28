const QrTracking = require('../models/qr_tracking')
const User = require('../models/users')
const Attachment = require('../models/attachment');
const moment = require('moment')

const checkAuthenticate = require('../middleware/auth');
const upload = require('../config/multer');
const fs = require('fs');
const { render } = require('ejs');

module.exports = function route(app){
    app.get('/users/search', async(req, res) => {
        const avatar_name = req.query.avatar_name;
        if (!avatar_name){
            res.status(400).json({
                status: 400,
                data: null,
                message: '1'
            })
            return
        }

        const user = await User.findOne({avatar: avatar_name})
        if (!user){
            res.status(400).json({
                status: 400,
                data: null,
                message: '2'
            })
            return
        }

        res.status(200).json({
            status: 200,
            data: {
                _id: user._id, 
                name: user.name,
                email: user.email, 
                avatar: user.avatar, 
                qrCode: user.qrCode
            }
        })
    })

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

    app.post('/my-profile/change_avatar', checkAuthenticate, upload.single('img'), async(req,res) =>{
        if (!req.file){
            res.status(400).json({
                status: 400,
                file: null,
                message: 'Null file'
            })
            return
        }
        const attachment = new Attachment({
            ...req.file,
            filename: req.file.filename.split('.')[0]
        });
        await attachment.save()

        req.user.avatar = attachment.filename
        req.user.save()

        res.redirect('/my-profile')
    })


    app.post('/uploader', upload.single('img') ,async (req, res) =>{
        if (!req.file){
            res.status(400).json({
                status: 400,
                file: null,
                message: 'Null file'
            })
            return
        }
        const attachment = new Attachment({
            ...req.file,
            filename: req.file.filename.split('.')[0]
        });
        await attachment.save()
        res.json(attachment);
    })

    app.get('/uploader/:filename', async (req,res) =>{
        const filename = req.params.filename

        const attachment = await Attachment.findOne({filename})

        if (!attachment){
            res.status(400).json({
                status: 400,
                data: null
            })
            return
        }
        
        res.sendFile( process.cwd() + '/' + attachment.path);
    })
}
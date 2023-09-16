const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const db = require('./config/database');
// const route = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const session = require('express-session');
var passport = require('./config/passport');
const checkAuthenticate = require('./middleware/auth');
const saltRounds = 10;
const bcrypt = require("bcrypt");
app.use('/', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(cors());

app.use(cookieParser());

app.use(session({
    secret : "fms-secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.authenticate('session'));
app.use(passport.initialize());
app.use(passport.session());

db.connect();

// route(app);

app.get('/', checkAuthenticate ,(req, res) => {
    res.render('pages/home');
})

app.get('/login', (req, res) =>{
    res.render('pages/auth/login')
})

app.post('/login', passport.authenticate('local', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));

app.get('/register', (req, res) => {
    res.render('pages/auth/register', {errors: []})
})

const User = require('./models/users'); 
app.post('/register', async (req, res) => {    
    if (
        req.body.email === "" ||
        req.body.name === "" ||
        req.body.password  === "" ||
        req.body.password_confirmation === ""
    ){
        res.render('pages/auth/register', {errors: [{message: 'All fields are required.'}]});
        return
    }

    existUser = await User.findOne({email: req.body.email});
    if (existUser){
        res.render('pages/auth/register', {errors: [{message: 'Email is exist.'}]});
        return
    }
    if (req.body.password !== req.body.password_confirmation){
        res.render('pages/auth/register', {errors: [{message: 'Password is not matched.'}]});
        return
    }

    try{
        const user = new User(req.body);
        user.password = await bcrypt.hash(user.password, saltRounds)
        await user.save();
        res.redirect('/login')
    }catch(err){
        console.log(err);
        res.render('pages/auth/register', {errors: [{message: 'Server error.'}]});
    }

})

app.get('/my-profile', checkAuthenticate, (req, res) =>{
    res.render('pages/auth/my-profile', {current_user: req.user});
})
app.get('/logout', (req, res) =>{
    req.logout((err) =>{
        if (err) { return next(err); }
        res.redirect('/');
    });
})
app.listen(3000, (req, res) =>{
    console.log('app run 3000');
})
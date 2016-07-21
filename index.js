'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express()

const M = require('./server/schemas.js')
const config = require('./config')

const VERIFICATION_TOKEN = config.VERIFICATION_TOKEN;
const FACEBOOK_APP_ID = config.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = config.FACEBOOK_APP_SECRET;

app.set('port', (process.env.PORT || 3000))
app.set('view engine', 'ejs')

require('./server/passport-config')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use(require('./routes/broadcast'))
app.use(require('./routes/games'))
app.use(require('./routes/payment'))
app.use(require('./routes/stats'))
app.use(require('./routes/webhook'))


app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login',
  passport.authenticate('local', { successRedirect: '/broadcast',
                                   failureRedirect: '/login'
                                 })
);

app.get('/', function(req, res){
  res.render('home')
})

app.get('/policy', function(req, res){
  res.render('policy');
})


let server = app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'));
})

module.exports = server;

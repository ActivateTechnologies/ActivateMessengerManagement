'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express()

app.set('port', (process.env.PORT || 3000))
app.set('view engine', 'ejs')
app.set('views', __dirname)

require('./passport-config')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(session({
    secret: "some-secret",
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, './../public')));

app.use(require('./broadcast/router'))
app.use(require('./conversation/router'))
app.use(require('./dashboard/router'))
app.use(require('./events/router'))
app.use(require('./login/router'))
app.use(require('./payment/router'))
app.use(require('./site/router'))
app.use(require('./users/router'))

let server = app.listen(app.get('port'), function() {
  console.log('Magic happens on port', app.get('port'));
})

module.exports = server;

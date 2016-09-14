'use strict'

const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
  passport.use(new LocalStrategy(
    function(username, password, done) {
      if (username === "kickabout"
            && password === "activate098"){
        return done(null, {code: 'kickabout'})
      }
      if (username === "uwe"
            && password === "password"){
        return done(null, {code: 'uwe'})
      }
      if (username === "ucl"
            && password === "password"){
        return done(null, {code: 'ucl'})
      }
      else {
        return done(null, false)
      }
    }
  ));

  passport.serializeUser(function(code, done) {
    done(null, code);
  });

  passport.deserializeUser(function(code, done) {
    done(null, code);
  });
}

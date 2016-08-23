const LocalStrategy = require('passport-local').Strategy;
const sensitive = require('./../sensitive.js')

module.exports = function(passport){
  passport.use(new LocalStrategy(
    function(username, password, done) {
      if (username === sensitive.username && password === sensitive.password){
        console.log("correct");
        return done(null, [])
      }
      else {
        console.log("incorrect");
        return done(null, false)
      }
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, "serialized");
  });

  // used to deserialize the user
  passport.deserializeUser(function(str, done) {
      done(null, "deserialized");
  });
}

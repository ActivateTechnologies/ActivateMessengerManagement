const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
  passport.use(new LocalStrategy(
    function(username, password, done) {
      if (username === "alex@activatetechnologies.co.uk"
            && password === "activate098"){
        return done(null, {code: 'kickabout'})
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

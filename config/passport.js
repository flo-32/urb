// config/passport.js
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

var User = require('../app/models/user');

var configAuth = require('../config/config');

module.exports = function (passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass back the entire request to the callback
    }, function (req, email, password, done) { // callback with email and password from our form
        User.findOne({'email': email}, function (err, user) {
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user) {
                console.log('no user is found');
                return done(null, false);
            }

            // if the user is found but the password is wrong
            if (!user.validPassword(password)) {
                console.log('password is wrong');
                return done(null, false);
            }

            // all is well, return successful user
            console.log('successful login');
            return done(null, user);
        });
    }));

    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: ['id', 'emails', 'name']

    }, function (token, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOne({'facebook.id': profile.id}, function (err, user) {
                if (err) {
                    return done(err);
                }

                // if the user is found, then log them in
                if (user) {
                    console.log('fb found user' );
                    return done(null, user); // user found, return that user
                } else {
                    console.log('fb new user');

                    // if there is no user found with that facebook id, create them
                    var newUser = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                    newUser.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function (err) {
                        if (err) {
                            throw err;
                        }

                        // if successful, return the new user
                        console.log('fb saved user ');
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
};

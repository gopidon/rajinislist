
var passport = require('passport');
var _ = require('lodash');
// These are different types of authentication strategies that can be used with Passport. 
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google').Strategy;
var config = require('./config');
var db = require('./sequelize');

//Serialize sessions
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    db.User.find({where: {id: id}}).success(function(user){
        console.log('Session: { id: ' + user.id + ', username: ' + user.username + ' }');
        done(null, user);
    }).error(function(err){
        done(err, null);
    });
});

//Use local strategy
passport.use('local',new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    db.User.find({ where: { email: email }}).success(function(user) {
      if (!user) {
        done(null, false, {message: "User '"+email+"' not found!"});
      } else if (!user.authenticate(password)) {
        done(null, false, {message: 'Oops! Wrong password.'});
      } else {
        console.log('Login (local) : { id: ' + user.id + ', username: ' + user.username + ' }');
        done(null, user);
      }
    }).error(function(err){
      done(err);
    });
  }
));

//    Use twitter strategy
passport.use('twitter',new TwitterStrategy({
        consumerKey: config.twitter.clientID,
        consumerSecret: config.twitter.clientSecret,
        callbackURL: config.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
        
        db.User.find({where: {twitterUserId: profile.id}}).success(function(user){
            if(!user){
                db.User.create({
                    displayname: profile.displayName,
                    twitterUserId: profile.id,
                    twitterUserName: profile.username,
                    twitterDisplayName: profile.displayName,
                    twitterToken: token,
                    twitterTokenSecret: tokenSecret,
                    provider: 'twitter'
                }).success(function(u){
                    console.log('New User (twitter) : { id: ' + u.id + ', username: ' + u.username + ' }');
                    done(null, u);
                });
            } else {
                console.log('Login (twitter) : { id: ' + user.id + ', username: ' + user.username + ' }');
                done(null, user);
            }
        
        }).error(function(err){
            done(err, null);
        });
    }
));


// Use facebook strategy
passport.use('facebook',new FacebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {

        db.User.find({where : {facebookUserId: profile.id}}).success(function(user){
            if(!user){
                db.User.create({
                    displayname: profile.displayName,
                    facebookUserId: profile.id,
                    facebookUserName: profile.username,
                    facebookDisplayName: profile.displayName,
                    facebookEmail: profile.emails[0].value,
                    facebookToken: accessToken,
                    provider: 'facebook'

                }).success(function(u){
                    console.log('New User (facebook) : { id: ' + u.id + ', username: ' + u.username + ' }');
                    done(null, u);
                })
            } else {
                console.log('Login (facebook) : { id: ' + user.id + ', username: ' + user.username + ' }');
                done(null, user);
            }
        }).error(function(err){
            done(err, null);
        })
    }
));

//Use google strategy
passport.use('google',new GoogleStrategy({
    returnURL: config.google.callbackURL,
    realm: config.google.realm
  },
  function(identifier, profile, done) {
    console.log(identifier);
    console.log(profile);

    db.User.find({where: {openId: identifier}}).success(function(user){
        if(!user){
            db.User.create({
                displayname: profile.displayName,
                googleUserName: profile.displayName.replace(/ /g,''),
                googleDisplayName: profile.displayName,
                googleEmail: profile.emails[0].value,
                openId: identifier,
                provider: 'google'
            }).success(function(u){
                console.log('New User (google) : { id: ' + u.id + ', username: ' + u.username + ' }');
                done(null, u);
            })
        } else {
            console.log('Login (google) : { id: ' + user.id + ', username: ' + user.username + ' }');
            done(null, user);
        }
    }).error(function(err){
        done(err, null);
    });
  }
));

module.exports = passport;


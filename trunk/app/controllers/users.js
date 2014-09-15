/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/main');
};

/**
 * Show login form
 */
exports.signin = function(req, res) {

    res.render('users/signin', {
        title: 'Signin',
        _csrf: req.csrfToken(),
        message: req.flash("error")
    });
};

/**
 * Show sign up form
 */
exports.signup = function(req, res) {
    res.render('users/signup', {
        title: 'Sign up',
        _csrf: req.csrfToken(),
        message: req.flash('signupMessage')
    });
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    if(req.user) {
        console.log('Logout: { id: ' + req.user.id + ', username: ' + req.user.username + '}');
    }
    req.session.destroy();
    req.logout();

    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res, next) {
    var message = null;



    var user = db.User.build(req.body);
    user.displayname = user.name;
    user.provider = 'local';
    user.salt = user.makeSalt();
    user.hashedPassword = user.encryptPassword(req.body.password, user.salt);
    console.log('New User (local) : { id: ' + user.id + ' username: ' + user.username + ' }');
    
    user.save().success(function(){
      req.login(user, function(err){
        if(err) return next(err);
        res.redirect('/main');
      });
    }).error(function(err){
      res.render('users/signup',{
          message: message,
          user: user
      });
    });
};

/**
 * Send User
 */
exports.me = function(req, res) {
    res.render('main', {
        user : req.user ? req.user : null// get the user out of session and pass to template
    });
    //res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User.find({where : { id: id }}).success(function(user){
      if (!user) return next(new Error('Failed to load User ' + id));
      req.profile = user;
      next();
    }).error(function(err){
      next(err);
    });
};

//check duplicate users

exports.checkUniqueUser = function(req,res,next) {
    var email = req.body.email;
    //Check if email is already registered
    db.User.find({where : { email: email }}).success(function(user){
        if (user){
            res.render('users/signup',{
                _csrf: req.csrfToken(),
                message: 'User '+ email + ' already registered!'
            });
        }
        else{
            next();
        }
    }).error(function(err){
        res.render('users/signup',{
            _csrf: req.csrfToken(),
            message: 'Unexpected error:'+err
        });
    });
};


var users       = require('../app/controllers/users');
var articles    = require('../app/controllers/articles');
var customers    = require('../app/controllers/customers');
var lookups    = require('../app/controllers/lookups');
var index       = require('../app/controllers/index');
var shows    = require('../app/controllers/shows');

exports.init = function(app, passport, auth) {

    console.log('Initializing Routes');

    // User Routes
    app.get('/signin', users.signin);
    app.get('/signup', users.signup);
    app.get('/signout', users.signout);
    app.get('/main', users.me);



    // Setting up the users api
    app.post('/users', users.checkUniqueUser, users.create);

    // Setting the local strategy route
    app.post('/users/session', passport.authenticate('local', {
        successRedirect : '/main',
        failureRedirect: '/signin',
        failureFlash: true
    }));

    // Setting the facebook oauth routes
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: ['email', 'user_about_me']

    }));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect : '/main',
        failureRedirect: '/signin'
    }));

    // Setting the twitter oauth routes
    app.get('/auth/twitter', passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect : '/main',
        failureRedirect: '/signin'
    }));

    // Setting the google oauth routes
    app.get('/auth/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));

    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect : '/main#!/home', // had to set  '#!/home'  explicitly
        failureRedirect: '/signin'
    }));

    // Finish with setting up the userId param
    app.param('userId', users.user);

    // Article Routes
    app.get('/articles', articles.all);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:articleId', articles.show);
    app.put('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.update);
    app.delete('/articles/:articleId', auth.requiresLogin, auth.article.hasAuthorization, articles.destroy);

    // Finish with setting up the articleId param
    // Note: the articles.article function will be called everytime then it will call the next function. 
    app.param('articleId', articles.article);

    // Customer Routes
    app.get('/customers', customers.all);
    app.post('/customers', auth.requiresLogin, customers.create);
    app.get('/customers/:customerId', customers.show);
    app.put('/customers/:customerId', auth.requiresLogin, customers.update);
    app.delete('/customers/:customerId', auth.requiresLogin, customers.destroy);

    app.param('customerId', customers.customer);

    // Show Routes
    app.get('/shows/id/search/user/limit/:limit', shows.all);
    app.get('/shows/id/search//user/limit/:limit', shows.all);
    app.get('/shows/id/search/:key/user/limit/:limit', shows.searchByKey);
    app.get('/shows/id/search/user/:showUserId/limit/:limit', auth.requiresLogin, shows.searchByUser);
    app.post('/shows/id/search/user/limit', auth.requiresLogin, shows.create);
    app.get('/shows/id/:showId/search/user/limit/:limit', shows.showMe);
    app.put('/shows/:showId', auth.requiresLogin, shows.update);
    app.delete('/shows/id/:showId/search/user/limit', auth.requiresLogin, shows.destroy);

    app.param('showId', shows.show);

    // Lookup Routes
    app.get('/lookups', lookups.all);
    app.get('/lookups/lookup/type/:lookupType/value/:lookupTypeValue', lookups.lookupTypes);
    app.post('/lookups', auth.requiresLogin, lookups.create);
    app.get('/lookups/lookup/:lookupId', lookups.show);
    app.put('/lookups/lookup/:lookupId', auth.requiresLogin, lookups.update);
    app.delete('/lookups/lookup/:lookupId', auth.requiresLogin, lookups.destroy);

    app.param('lookupId', lookups.lookup);



    // Home route
    app.get('/', users.me);

};

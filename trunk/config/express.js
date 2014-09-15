/**
 * Module dependencies.
 */
var express = require('express');
var flash = require('connect-flash');
var helpers = require('view-helpers');
var config = require('./config');
var session = require('express-session');
var favicon = require('serve-favicon');
var morgan  = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var methodOverride = require('method-override');
var errorhandler = require('errorhandler');
var compression = require('compression');
var csrf    = require('csurf');

module.exports = function(app, passport) {

    console.log('Initializing Express');



    app.set('showStackError', true);    
    
    //Prettify HTML
    app.locals.pretty = true;

    //Should be placed before express.static
    app.use(compression({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        threshold: 512
    }));



    //Setting the fav icon and static folder
    app.use(favicon(config.root + '/public/favicon.ico'));
    app.use(serveStatic(config.root + '/public'));

    //Don't use logger for test env
    if (process.env.NODE_ENV !== 'test') {
        app.use(morgan('dev'));
    }

    //Set views path, template engine and default layout
    app.set('views', config.root + '/app/views');
    //app.set('view engine', 'jade');
    app.set('view engine', 'ejs'); // set up ejs for templating

    //Enable jsonp
    app.enable("jsonp callback");


        //cookieParser should be above session
        app.use(cookieParser());

        // request body parsing middleware should be above methodOverride
        app.use(bodyParser.urlencoded());
        app.use(bodyParser.json());
        app.use(methodOverride());

        //express/mongo session storage
        app.use(session({ secret: '$uper$ecret$e$$ionKey'}));
        app.use(csrf({value: csrfValue}));

        app.use(function(req, res, next) {
            res.cookie('XSRF-TOKEN', req.csrfToken());
            next();
        });





        //dynamic helpers
        app.use(helpers(config.app.name));

        //use passport session
        app.use(passport.initialize());
        app.use(passport.session());

        //connect flash for flash messages. Put it after passport.session only.
        app.use(flash());





        //Assume "not found" in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
       /* app.use(function(err, req, res, next) {
            //Treat as 404
            if (~err.message.indexOf('not found')) return next();

            //Log it
            console.error(err.stack);

            //Error page
            res.status(500).render('500', {
                error: err.stack
            });
        });

        //Assume 404 since no middleware responded
        app.use(function(req, res, next) {
            res.status(404).render('404', {
                url: req.originalUrl,
                error: 'Not found'
            });
        });*/

    //routes should be at the last
    app.use(express.Router());


    var csrfValue = function(req) {
        var token = (req.body && req.body._csrf)
            || (req.query && req.query._csrf)
            || (req.headers['x-csrf-token'])
            || (req.headers['x-xsrf-token']);
        return token;
    };

};

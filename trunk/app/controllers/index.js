/**
 * Module dependencies.
 */
var _ = require('underscore');


exports.render = function(req, res) {
    res.render('main', {
        user: req.user ? JSON.stringify(req.user) : "null"
    });
};

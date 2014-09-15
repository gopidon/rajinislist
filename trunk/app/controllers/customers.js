/**
 * Created by gopi on 7/11/14.
 */


/**
 * Module dependencies.
 */
var db = require('../../config/sequelize');


/**
 * Find article by id
 * Note: This is called every time that the parameter :articleId is used in a URL.
 * Its purpose is to preload the article on the req object then call the next function.
 */
exports.customer = function(req, res, next, id) {
    console.log('id => ' + id);
    db.Customer.find({ where: {id: id}, include: [db.Lookup]}).success(function(customer){
        if(!customer) {
            return next(new Error('Failed to load customer ' + id));
        } else {
            req.customer = customer;
            return next();
        }
    }).error(function(err){
            return next(err);
        });
};

/**
 * Create a article
 */
exports.create = function(req, res) {
    //console.log("Request body is:"+JSON.stringify(req.body));
    // save and return and instance of article on the res object.
    db.Customer.create(req.body,{include: [db.Lookup]}).success(function(customer){
        if(!customer){
            return res.send('users/signup', {errors: err});
        } else {
            //console.log("Created Customer:"+JSON.stringify(customer));
            return res.jsonp(customer);
        }
    }).error(function(err){
            return res.send('users/signup', {
                errors: err,
                status: 500
            });
        });
};

/**
 * Update a article
 */
exports.update = function(req, res) {

    // create a new variable to hold the article that was placed on the req object.
    var customer = req.customer;

    customer.updateAttributes({
        name: req.body.name,
        description: req.body.description,
        age: req.body.age,
        type: req.body.type,
        startdate: req.body.startdate,
        from: req.body.from,
        to: req.body.to,
        LookupId: req.body.LookupId
    }).success(function(a){
            return res.jsonp(a);
        }).error(function(err){
            return res.render('error', {
                error: err,
                status: 500
            });
        });
};

/**
 * Delete an article
 */
exports.destroy = function(req, res) {

    // create a new variable to hold the article that was placed on the req object.
    var customer = req.customer;

    customer.destroy().success(function(){
        return res.jsonp(customer);
    }).error(function(err){
            return res.render('error', {
                error: err,
                status: 500
            });
        });
};


/**
 * Show an article
 */
exports.show = function(req, res) {
    // Sending down the article that was just preloaded by the articles.article function
    // and saves article on the req object.
    return res.jsonp(req.customer);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
    db.Customer.findAll({include: [db.Lookup],order:'createdAt DESC'}).success(function(customers){
        return res.jsonp(customers);
    }).error(function(err){
            return res.render('error', {
                error: err,
                status: 500
            });
        });
};
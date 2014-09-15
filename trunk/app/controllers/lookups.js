/**
 * Created by gopi on 7/25/14.
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
exports.lookup = function(req, res, next, id) {
    console.log('id => ' + id);
    db.Lookup.find({ where: {id: id}}).success(function(lkp){
        if(!lkp) {
            return next(new Error('Failed to load lookup ' + id));
        } else {
            req.lookup = lkp;
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
    // augment the article by adding the UserId
    //req.body.UserId = req.user.id;
    // save and return and instance of article on the res object.
    db.Lookup.create(req.body).success(function(lkp){
        if(!lkp){
            return res.send('users/signup', {errors: err});
        } else {
            return res.jsonp(lkp);
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
    var lkp = req.lookup;

    lkp.updateAttributes({
        type: req.body.type,
        value: req.body.value
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
    var lkp = req.lookup;

    lkp.destroy().success(function(){
        return res.jsonp(lkp);
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
    return res.jsonp(req.lookup);
};



/**
 * List of Articles
 */
exports.all = function(req, res) {
    db.Lookup.findAll().success(function(lkps){
        return res.jsonp(lkps);
    }).error(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

exports.lookupTypes = function(req, res) {
    var type = req.params.lookupType;
    var value = req.params.lookupTypeValue;
    db.Lookup.findAll({ where: {type: type, value: {like: "%"+value+"%"}}}).success(function(lkps){
        return res.jsonp(lkps);
    }).error(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};

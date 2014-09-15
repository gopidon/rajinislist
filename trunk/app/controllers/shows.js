/**
 * Created by gopi on 8/11/14.
 */
var db = require('../../config/sequelize');
var Sequelize = require('sequelize-mysql').sequelize;


/**
 * Find article by id
 * Note: This is called every time that the parameter :articleId is used in a URL.
 * Its purpose is to preload the article on the req object then call the next function.
 */
exports.show = function(req, res, next, id) {
    console.log('id => ' + id);
    db.Show.find({ where: {id: id},include: [db.User]}).success(function(show){
        if(!show) {
            return next(new Error('Failed to load show ' + id));
        } else {

            req.show = show;
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
    db.Show.create(req.body).success(function(show){
        if(!show){
            return res.send('users/signup', {errors: err});
        } else {
            //console.log("Created show:"+JSON.stringify(show));
            return res.jsonp(show);
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
    var show = req.show;

    show.updateAttributes({
        show_name: req.body.show_name,
        show_venue: req.body.show_venue,
        show_venue_details: req.body.show_venue_details,
        show_time: req.body.show_time,
        contact_phone: req.body.contact_phone,
        contact_email: req.body.contact_email,
        contact_notes: req.body.contact_notes

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
    var show = req.show;

    show.destroy().success(function(){
        return res.jsonp(show);
    }).error(function(err){
        /*return res.render('error', {
            error: err,
            status: 500
        });*/
        return res.jsonp({"Delete Error":err});
    });
};

exports.searchByKey = function(req, res) {
    var key = req.params.key;
    db.Show.findAll({ where: Sequelize.or({show_name: {like: "%"+key+"%"}}, {show_venue:{like: "%"+key+"%"}})}).success(function(shows){
        return res.jsonp(shows);
     }).error(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });

    });
};

exports.searchByUser = function(req, res) {
    var userId = req.params.showUserId;
    db.Show.findAll({ where: {UserId: userId}}).success(function(shows){
        return res.jsonp(shows);
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
exports.showMe = function(req, res) {
    // Sending down the article that was just preloaded by the articles.article function
    // and saves article on the req object.
    return res.jsonp(req.show);
};

/**
 * List of Articles
 */
exports.all = function(req, res) {
    var filters = {order:'createdAt DESC'};
    var limit = req.params.limit;
    if(limit !== undefined && limit != -1)
    {
        filters.limit = limit;
    }
    db.Show.findAll(filters).success(function(shows){
        return res.jsonp(shows);
    }).error(function(err){
        return res.render('error', {
            error: err,
            status: 500
        });
    });
};
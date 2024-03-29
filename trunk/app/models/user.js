
/**
	* User Model
	*/

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {

	var User = sequelize.define('User', 
		{
			name: DataTypes.STRING,
            displayname: DataTypes.STRING,
			email: DataTypes.STRING,
			username: DataTypes.STRING,
			hashedPassword: DataTypes.STRING,
			provider: DataTypes.STRING,
			salt: DataTypes.STRING, 
			facebookUserId: DataTypes.INTEGER,
            facebookUserName: DataTypes.STRING,
            facebookDisplayName: DataTypes.STRING,
            facebookEmail: DataTypes.STRING,
            facebookToken: DataTypes.STRING,
			twitterUserId: DataTypes.INTEGER,
            twitterUserName: DataTypes.STRING,
            twitterDisplayName: DataTypes.STRING,
			twitterToken: DataTypes.STRING,
			twitterTokenSecret: DataTypes.STRING,
            googleUserName: DataTypes.STRING,
            googleDisplayName: DataTypes.STRING,
            googleEmail: DataTypes.STRING,
            openId: DataTypes.STRING,
			github: DataTypes.STRING
        },
		{
			instanceMethods: {
				makeSalt: function() {
					return crypto.randomBytes(16).toString('base64'); 
				},
				authenticate: function(plainText){
					return this.encryptPassword(plainText, this.salt) === this.hashedPassword;
				},
				encryptPassword: function(password, salt) {
					if (!password || !salt) return '';
					salt = new Buffer(salt, 'base64');
					return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
				}
			},
			associate: function(models) {
				User.hasMany(models.Article);
			}
		}
	);

	return User;
};

/**
 * Created by gopi on 7/25/14.
 */
module.exports = function(sequelize, DataTypes) {

    var Lookup = sequelize.define('Lookup', {
            type: DataTypes.STRING,
            value: DataTypes.STRING
        }
    );

    return Lookup;
};
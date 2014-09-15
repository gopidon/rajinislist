/**
 * Created by gopi on 7/11/14.
 */
module.exports = function(sequelize, DataTypes) {

    var Customer = sequelize.define('Customer', {
            name: DataTypes.STRING,
            description: DataTypes.TEXT,
            age: DataTypes.INTEGER.UNSIGNED,
            type: DataTypes.STRING,
            startdate: DataTypes.DATE,
            from: DataTypes.DATE,
            to: DataTypes.DATE
        },
        {
            associate: function(models){
                Customer.belongsTo(models.Lookup);
            }
        }
    );

    return Customer;
};
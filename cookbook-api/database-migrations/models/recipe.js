'use strict';
module.exports = function (sequelize, DataTypes) {
    var Recipe = sequelize.define('Recipe', {
        name: DataTypes.STRING,
        ingredients: DataTypes.STRING,
        directions: DataTypes.STRING
    }, {});
    Recipe.associate = function (models) {
        // associations can be defined here
    };
    return Recipe;
};

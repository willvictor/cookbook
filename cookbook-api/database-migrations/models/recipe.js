'use strict';
module.exports = function (sequelize, DataTypes) {
    var Recipe = sequelize.define('Recipe', {
        recipeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "recipe_id"
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_id"
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "name"
        },
        ingredients: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "ingredients"
        },
        directions: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "directions"
        },
        dateCreated: { 
            type: DataTypes.DATE, 
            defaultValue: DataTypes.NOW,
            field: "date_created"
        },
        dateUpdated: { 
            type: DataTypes.DATE, 
            allowNull: true,
            field: "date_updated"
        }
    }, {
        tableName: 'recipes',
        timestamps: true,
        updatedAt: "date_updated",
        createdAt: "date_created"
    });
    Recipe.associate = function (models) {
        Recipe.belongsTo(models.User, {
            foreignKey: {
                name: 'user_id'
            }
        })
    };
    return Recipe;
};

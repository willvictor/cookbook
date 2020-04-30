'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "user_id"
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name"
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name"
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "email"
    },
    googleSubId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "google_sub_id"
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "image_url"
    },
  }, {
    tableName: 'users',
    timestamps: true,
    updatedAt: false,
    createdAt: "date_created"
  });
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
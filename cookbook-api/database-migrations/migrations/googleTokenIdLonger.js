'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
        'Users', 
        'googleTokenId',
        {
            type: Sequelize.STRING(2500)
        });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
        'Users', 
        'googleTokenId',
        {
            type: Sequelize.STRING(255)
        });
  }
};
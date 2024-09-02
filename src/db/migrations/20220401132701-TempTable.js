'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable('temp', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                unique: true,
                primaryKey: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false
            },

            created_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            updated_by: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'users',
                    key: 'id'
                }
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM('active', 'deleted', 'disabled'),
                allowNull: false,
                defaultValue: 'active'
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.dropTable('temp');
    }
};

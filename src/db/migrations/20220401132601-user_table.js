'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getCommonAttributes } = require('../common-migration-attributes');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                allowNull: false,
                unique: true,
                primaryKey: true
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            email: {
                type: Sequelize.STRING,
                allowNull: true
            },
            user_type: {
                type: Sequelize.ENUM('super_admin', 'customer'),
                allowNull: false
            },
            mobile: {
                type: Sequelize.STRING,
                allowNull: false
            },
            password: {
                type: Sequelize.STRING
            },
            is_phone_verified: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            gender: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: true
            },
            dob: {
                type: Sequelize.DATE,
                allowNull: true
            },
            otp: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            otp_expiry: {
                type: Sequelize.DATE,
                allowNull: true
            },
            ...getCommonAttributes(Sequelize)
        });
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.dropTable('users');
    }
};

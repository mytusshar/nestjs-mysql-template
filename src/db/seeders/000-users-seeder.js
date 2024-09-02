'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('users', [
            {
                first_name: 'Super',
                last_name: 'Admin',
                email: 'admin@pp.com',
                user_type: 'super_admin',
                mobile: '8888888881',
                password: '$2b$10$b1cV6FTd0BSfD7QC5EY7v.jX6DVIn5f8wjpoiYNxnj2VU48jpjocq', // Admin!23
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_phone_verified: true
            },
            {
                first_name: 'Customer',
                last_name: 'Customer',
                email: 'customer@pp.com',
                user_type: 'customer',
                mobile: '8888888882',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                is_phone_verified: true,
                password: '$2b$10$b1cV6FTd0BSfD7QC5EY7v.jX6DVIn5f8wjpoiYNxnj2VU48jpjocq' // Admin!23
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('users', null, {});
    }
};

module.exports = {
    getCommonAttributes: (Sequelize) => {
        return {
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
        };
    }
};

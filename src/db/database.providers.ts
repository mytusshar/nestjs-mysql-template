import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from '../entities/user.entity';
import { Temp } from '../entities/temp.entity';
import { Logger } from '@nestjs/common';

export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: async () => {
            let config;
            switch (process.env.NODE_ENV) {
                case DEVELOPMENT:
                    config = databaseConfig.development;
                    break;
                case TEST:
                    config = databaseConfig.test;
                    break;
                case PRODUCTION:
                    config = databaseConfig.production;
                    break;
                default:
                    config = databaseConfig.development;
            }
            const sequelize = new Sequelize(config);
            Logger.log(
                `Connecting database using config:: Host => ${config.host}, PORT => ${config.port}, DB => ${config.database}, Username => ${config.username},  Password => ${config.password}`
            );
            sequelize
                .authenticate()
                .then(() => {
                    Logger.log('Database connection has been established successfully.');
                })
                .catch((err) => {
                    Logger.error('Unable to connect to the database:', err);
                    process.exit(1);
                });
            sequelize.addModels([Temp, User]);
            return sequelize;
        }
    }
];

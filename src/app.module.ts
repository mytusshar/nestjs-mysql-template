import { GlobalExceptionFilter } from './core/global-exception.filter';
import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './db/database.module';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({
                NODE_ENV: Joi.string().valid('development', 'production', 'test', 'provision').default('development'),
                PORT: Joi.number().default(3000),
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.string().required(),
                DB_USER: Joi.string().required(),
                DB_PASS: Joi.string().required(),
                DB_NAME: Joi.string().required(),
                DB_DIALECT: Joi.string().required(),
                JWT_SECRET_KEY: Joi.string().required(),
                JWT_TOKEN_EXPIRY_SECONDS: Joi.number().required()
            })
        }),
        DatabaseModule,
        AuthModule,
        UserModule
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: GlobalExceptionFilter
        },
        AppService
    ]
})
export class AppModule {}

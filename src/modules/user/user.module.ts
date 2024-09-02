import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { userProviders } from '../../db/providers/user.providers';

@Module({
    controllers: [UserController],
    providers: [UserService, ...userProviders],
    exports: [UserService, ...userProviders]
})
export class UserModule {}

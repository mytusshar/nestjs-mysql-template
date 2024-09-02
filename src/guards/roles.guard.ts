import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '../enums/user-type.enum';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        roles.push(UserType.SUPER_ADMIN);
        const request = context.switchToHttp().getRequest();
        const user_type = request.user.user_type;
        const authorized = roles.includes(user_type);
        if (!authorized) {
            throw new UnauthorizedException('You are not authorized to do this operation.');
        }
        return authorized;
    }
}

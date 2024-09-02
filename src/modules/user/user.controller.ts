import { Controller, Get, Request, Body, Param, Delete, Put, UseInterceptors, UseGuards } from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiUnauthorizedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiBasicAuth
} from '@nestjs/swagger';
import { TransformInterceptor } from '../../core/transform.interceptor';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { TableNameTagsEnum } from '../../enums/table-name-tags.enum';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { PrintLog } from '../../config/logger.config';

const tableNameTag: string = TableNameTagsEnum.USERS;

@Controller({
    path: 'user',
    version: '1'
})
@ApiTags(tableNameTag)
@UseInterceptors(TransformInterceptor)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: `Get ${tableNameTag}` })
    @ApiOkResponse({
        description: `${tableNameTag} fetched successfully`
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid/Expired token'
    })
    @ApiInternalServerErrorResponse({
        description: 'Technical error while processing'
    })
    @PrintLog
    async findOne(@Param('id') id: number) {
        const resp = await this.userService.findOne(id);
        return { message: `${tableNameTag} fetched successfully`, data: resp };
    }

    @Put('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: `Update ${tableNameTag}` })
    @ApiOkResponse({
        description: `${tableNameTag} updated successfully`
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid/Expired token'
    })
    @ApiInternalServerErrorResponse({
        description: 'Technical error while processing'
    })
    @PrintLog
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto, @Request() req) {
        const resp = await this.userService.update(req.user.sub, id, updateUserDto);
        return { message: `${tableNameTag} updated successfully`, data: resp };
    }

    @Put('/password/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: `Update ${tableNameTag} password` })
    @ApiOkResponse({
        description: `${tableNameTag} password updated successfully`
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid/Expired token'
    })
    @ApiInternalServerErrorResponse({
        description: 'Technical error while processing'
    })
    @PrintLog
    async updateUserPassword(
        @Param('id') id: number,
        @Body() updateUserPasswordDto: UpdateUserPasswordDto,
        @Request() req
    ) {
        const resp = await this.userService.updateUserPassword(req.user.sub, id, updateUserPasswordDto);
        return { message: `${tableNameTag} password updated successfully`, data: resp };
    }

    @Delete('/:id')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: `Delete ${tableNameTag}` })
    @ApiOkResponse({
        description: `${tableNameTag} deleted successfully`
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid/Expired token'
    })
    @ApiInternalServerErrorResponse({
        description: 'Technical error while processing'
    })
    @PrintLog
    async delete(@Param('id') id: number) {
        const resp = await this.userService.delete(id);
        return { message: `${tableNameTag} deleted successfully`, data: resp };
    }
}

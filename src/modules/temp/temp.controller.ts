import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { TempService } from './temp.service';
import { CreateTempDto } from './dto/create-temp.dto';
import { UpdateTempDto } from './dto/update-temp.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TransformInterceptor } from '../../core/transform.interceptor';

@Controller({
    path: 'temp',
    version: '1'
})
@ApiTags('Temp')
@UseInterceptors(TransformInterceptor)
@ApiBearerAuth()
export class TempController {
    constructor(private readonly tempService: TempService) {}

    @Post()
    async create(@Body() createTempDto: CreateTempDto) {
        const temp = await this.tempService.create(createTempDto);
        return { message: 'Temp created successfully', data: temp };
    }

    @Get()
    async findAll() {
        const temps = await this.tempService.findAll();
        return { message: 'Temp fetched successfully', data: temps };
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tempService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTempDto: UpdateTempDto) {
        return this.tempService.update(+id, updateTempDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tempService.remove(+id);
    }
}

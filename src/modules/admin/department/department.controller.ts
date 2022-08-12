import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateDepartmentDto } from './dto/create-department.dto';

@Controller('department')
@ApiTags('部门')
export class DepartmentController {
    constructor(private readonly departmentService: DepartmentService) {}

    @Get()
    public async list() {
        return await this.departmentService.getSysDepartmentTree();
    }

    @Put()
    public async create(@Body() createDepartmentDto: CreateDepartmentDto) {
        return await this.departmentService.createSysDepartment(createDepartmentDto);
    }

    @Get(':depId')
    public async info(@Param('depId') depId: string) {
        return await this.departmentService.findDepInfoById(depId);
    }

    @Delete(':depId')
    public async delete(@Param('depId') depId: string) {
        return await this.departmentService.deleteDepById(depId);
    }
}

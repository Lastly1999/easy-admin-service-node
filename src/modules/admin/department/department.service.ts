import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import SysDepartment from '../../../entity/admin/sys-department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UtilService } from '../../common/util/util.service';

@Injectable()
export class DepartmentService {
    constructor(@InjectRepository(SysDepartment) private readonly departmentRepository: Repository<SysDepartment>, private readonly utilService: UtilService) {}

    /**
     * 获取部门树
     */
    public async getSysDepartmentTree() {
        const deps = await this.departmentRepository.find();
        return this.utilService.toTree(deps);
    }

    /**
     * 创建部门树
     */
    public async createSysDepartment(createDepartmentDto: CreateDepartmentDto) {
        try {
            const result = await this.departmentRepository
                .createQueryBuilder('dep')
                .insert()
                .into(SysDepartment)
                .values({
                    parentId: createDepartmentDto.parentId,
                    name: createDepartmentDto.depName,
                    orderNum: createDepartmentDto.parentId,
                })
                .execute();
            if (result.raw.affectedRows > 0) {
                return null;
            } else {
                throw new HttpException('新增失败', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 查询部门详情
     * @param depId
     */
    public async findDepInfoById(depId: string) {
        return await this.departmentRepository.findOne({
            where: {
                id: Number(depId),
            },
        });
    }

    /**
     * 删除部门
     * @param depId
     */
    public async deleteDepById(depId: string) {
        return await this.departmentRepository.delete(depId);
    }
}

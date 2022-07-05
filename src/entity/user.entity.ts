import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoleEntity } from './role.entity';
import { DepartmentEntity } from './department.entity';

@Entity({ name: 'sys_user' })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    userName: string;
    @Column()
    passWord: string;
    @Column({ nullable: true })
    email: string;
    @Column({ nullable: true })
    nikeName: string;
    @Column({ nullable: true })
    address: string;
    @CreateDateColumn()
    createAt: Date;
    @UpdateDateColumn()
    updateAt: Date;
    @DeleteDateColumn()
    deleteAt: Date;
    @ManyToMany((type) => RoleEntity, (roleEntity) => roleEntity.users)
    roles: RoleEntity[];
    @ManyToMany((type) => DepartmentEntity, (departmentEntity) => departmentEntity.id)
    @JoinTable({
        name: 'sys_user_department',
    })
    deps: DepartmentEntity[];
}

import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'sys_department' })
export class DepartmentEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    depName: string;
    @Column()
    depIcon: string;
    @Column()
    depPath: string;
    @Column()
    depRemark: string;
    @Column()
    depPid: number;
    @CreateDateColumn()
    createAt: Date;
    @UpdateDateColumn()
    updateAt: Date;
    @DeleteDateColumn()
    deleteAt: Date;
    @ManyToMany((type) => UserEntity, (userEntity) => userEntity.deps)
    users: UserEntity[];
}

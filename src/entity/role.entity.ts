import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { MenuEntity } from './menu.entity';

@Entity({ name: 'sys_role' })
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    roleName: string;
    @Column()
    roleRemark: string;
    @CreateDateColumn()
    createAt: Date;
    @UpdateDateColumn()
    updateAt: Date;
    @DeleteDateColumn()
    deleteAt: Date;
    @ManyToMany((type) => UserEntity, (userEntity) => userEntity.roles)
    @JoinTable({
        name: 'sys_user_role',
    })
    users: UserEntity[];
    @ManyToMany((type) => MenuEntity, (menuEntity) => menuEntity.roles)
    @JoinTable({
        name: 'sys_role_menu',
    })
    menus: MenuEntity[];
}

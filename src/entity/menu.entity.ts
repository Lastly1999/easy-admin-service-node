import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { RoleEntity } from './role.entity';

@Entity({ name: 'sys_menu' })
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  menuName: string;
  @Column()
  menuIcon: string;
  @Column()
  menuPid: string;
  @Column()
  menuPath: string;
  @CreateDateColumn()
  createAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @DeleteDateColumn()
  deleteAt: Date;
  @ManyToMany((type) => RoleEntity, (roleEntity) => roleEntity.menus)
  roles: RoleEntity[];
}

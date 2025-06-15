import { Entity, Column, OneToMany } from 'typeorm';
import { User } from '@entities/user.entity';
import { BaseEntity } from '@entities/base.entity';

@Entity('companies')
export class Company extends BaseEntity {
  @Column({ length: 50 })
  name: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}

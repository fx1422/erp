import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('base_customer')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 200 })
  name: string;

  @Column({ length: 50, nullable: true })
  type: string;

  @Column({ length: 100, nullable: true })
  contactPerson: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 500, nullable: true })
  address: string;

  @Column({ length: 50, nullable: true })
  taxId: string;

  @Column({ default: true })
  enabled: boolean;

  @Column({ default: 'A', length: 10 })
  level: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

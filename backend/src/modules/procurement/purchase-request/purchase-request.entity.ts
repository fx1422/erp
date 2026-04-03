import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PurchaseRequestItem } from './purchase-request-item.entity';

/**
 * 采购申请实体
 */
@Entity('proc_purchase_request')
export class PurchaseRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  requestNo: string;

  @Column({ nullable: true })
  departmentId: string;

  @Column({ length: 100, nullable: true })
  departmentName: string;

  @Column({ nullable: true })
  applicantId: string;

  @Column({ length: 50, nullable: true })
  applicantName: string;

  @Column({ length: 20, default: 'draft' })
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'converted';

  @Column({ length: 500, nullable: true })
  remark: string;

  @Column({ nullable: true })
  requiredDate: Date;

  @Column({ nullable: true })
  approvedAt: Date;

  @Column({ nullable: true })
  approvedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PurchaseRequestItem, (item) => item.request, { cascade: true })
  items: PurchaseRequestItem[];
}

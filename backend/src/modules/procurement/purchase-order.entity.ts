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
import { Supplier } from '../base-data/supplier/supplier.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@Entity('proc_purchase_order')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  orderNo: string;

  @Column()
  supplierId: string;

  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({ length: 20 })
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ length: 500, nullable: true })
  remark: string;

  @Column({ nullable: true })
  orderDate: Date;

  @Column({ nullable: true })
  expectedDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PurchaseOrderItem, (item) => item.order)
  items: PurchaseOrderItem[];
}

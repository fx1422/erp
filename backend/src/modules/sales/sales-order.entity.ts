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
import { Customer } from '../base-data/customer/customer.entity';
import { SalesOrderItem } from './sales-order-item.entity';

@Entity('sales_order')
export class SalesOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  orderNo: string;

  @Column()
  customerId: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ length: 20 })
  status: 'draft' | 'pending' | 'approved' | 'shipped' | 'completed' | 'cancelled';

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ length: 500, nullable: true })
  remark: string;

  @Column({ nullable: true })
  orderDate: Date;

  @Column({ nullable: true })
  deliveryDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => SalesOrderItem, (item) => item.order)
  items: SalesOrderItem[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StockOutItem } from './stock-out-item.entity';

/**
 * 出库单实体
 */
@Entity('inv_stock_out')
export class StockOut {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  outNo: string;

  @Column({ length: 20 })
  type: 'sales' | 'return' | 'transfer' | 'other';

  @Column({ length: 20, default: 'draft' })
  status: 'draft' | 'pending' | 'completed' | 'cancelled';

  @Column({ nullable: true })
  customerId: string;

  @Column({ length: 200, nullable: true })
  customerName: string;

  @Column({ nullable: true })
  salesOrderId: string;

  @Column({ length: 50, default: 'WH001' })
  warehouseId: string;

  @Column({ length: 100, default: '主仓库' })
  warehouseName: string;

  @Column({ length: 500, nullable: true })
  remark: string;

  @Column({ nullable: true })
  outDate: Date;

  @Column({ nullable: true })
  createdById: string;

  @Column({ length: 50, nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StockOutItem, (item) => item.stockOut, { cascade: true })
  items: StockOutItem[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { StockInItem } from './stock-in-item.entity';

/**
 * 入库单实体
 */
@Entity('inv_stock_in')
export class StockIn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  inNo: string;

  @Column({ length: 20 })
  type: 'purchase' | 'return' | 'transfer' | 'other';

  @Column({ length: 20, default: 'draft' })
  status: 'draft' | 'pending' | 'completed' | 'cancelled';

  @Column({ nullable: true })
  supplierId: string;

  @Column({ length: 200, nullable: true })
  supplierName: string;

  @Column({ nullable: true })
  purchaseOrderId: string;

  @Column({ length: 50, default: 'WH001' })
  warehouseId: string;

  @Column({ length: 100, default: '主仓库' })
  warehouseName: string;

  @Column({ length: 500, nullable: true })
  remark: string;

  @Column({ nullable: true })
  inDate: Date;

  @Column({ nullable: true })
  createdById: string;

  @Column({ length: 50, nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => StockInItem, (item) => item.stockIn, { cascade: true })
  items: StockInItem[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockOut } from './stock-out.entity';

/**
 * 出库明细实体
 */
@Entity('inv_stock_out_item')
export class StockOutItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stockOutId: string;

  @ManyToOne(() => StockOut, (stockOut) => stockOut.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stock_out_id' })
  stockOut: StockOut;

  @Column()
  productId: string;

  @Column({ length: 200 })
  productName: string;

  @Column({ length: 100, nullable: true })
  specification: string;

  @Column({ length: 20, nullable: true })
  unit: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column({ length: 500, nullable: true })
  remark: string;

  @Column({ nullable: true })
  batchNo: string;
}

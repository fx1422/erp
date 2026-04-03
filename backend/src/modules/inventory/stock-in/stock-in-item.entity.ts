import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockIn } from './stock-in.entity';

/**
 * 入库明细实体
 */
@Entity('inv_stock_in_item')
export class StockInItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stockInId: string;

  @ManyToOne(() => StockIn, (stockIn) => stockIn.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'stock_in_id' })
  stockIn: StockIn;

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

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SalesOrder } from './sales-order.entity';

@Entity('sales_order_item')
export class SalesOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => SalesOrder, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: SalesOrder;

  @Column()
  productId: string;

  @Column({ length: 200 })
  productName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'int', default: 0 })
  shippedQuantity: number;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Product } from '../base-data/product/product.entity';

@Entity('proc_purchase_order_item')
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => PurchaseOrder, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: PurchaseOrder;

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
  receivedQuantity: number;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../base-data/product/product.entity';

@Entity('inv_inventory_record')
export class InventoryRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ length: 50 })
  warehouseId: string;

  @Column({ length: 20 })
  type: 'in' | 'out' | 'transfer' | 'adjustment';

  @Column({ length: 50 })
  businessType: 'purchase' | 'sales' | 'return' | 'transfer' | 'adjustment';

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  beforeQuantity: number;

  @Column({ type: 'int' })
  afterQuantity: number;

  @Column({ length: 500, nullable: true })
  remark: string;

  @Column({ nullable: true })
  relatedOrderId: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  createdBy: string;
}

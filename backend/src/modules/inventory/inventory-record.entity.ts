import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('inv_inventory_record')
export class InventoryRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

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

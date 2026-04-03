import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseRequest } from './purchase-request.entity';

/**
 * 采购申请明细实体
 */
@Entity('proc_purchase_request_item')
export class PurchaseRequestItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requestId: string;

  @ManyToOne(() => PurchaseRequest, (request) => request.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'request_id' })
  request: PurchaseRequest;

  @Column()
  productId: string;

  @Column({ length: 200 })
  productName: string;

  @Column({ length: 100, nullable: true })
  specification: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ length: 20, nullable: true })
  unit: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedPrice: number;

  @Column({ length: 500, nullable: true })
  remark: string;
}

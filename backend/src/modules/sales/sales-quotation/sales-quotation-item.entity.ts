import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SalesQuotation } from './sales-quotation.entity';

/**
 * 销售报价明细实体
 */
@Entity('sales_quotation_item')
export class SalesQuotationItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quotationId: string;

  @ManyToOne(() => SalesQuotation, (quotation) => quotation.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quotation_id' })
  quotation: SalesQuotation;

  @Column()
  productId: string;

  @Column({ length: 200 })
  productName: string;

  @Column({ length: 100, nullable: true })
  specification: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 500, nullable: true })
  remark: string;
}

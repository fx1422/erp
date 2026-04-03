import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { SalesQuotationItem } from './sales-quotation-item.entity';

/**
 * 销售报价实体
 */
@Entity('sales_quotation')
export class SalesQuotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  quotationNo: string;

  @Column()
  customerId: string;

  @Column({ length: 200 })
  customerName: string;

  @Column({ length: 20, default: 'draft' })
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ length: 500, nullable: true })
  remark: string;

  @Column({ nullable: true })
  quotationDate: Date;

  @Column({ nullable: true })
  expiryDate: Date;

  @Column({ nullable: true })
  validUntil: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => SalesQuotationItem, (item) => item.quotation, { cascade: true })
  items: SalesQuotationItem[];
}

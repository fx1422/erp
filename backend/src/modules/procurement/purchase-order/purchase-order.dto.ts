import { IsString, IsOptional, IsNumber, Min, IsArray, ValidateNested, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * 采购订单明细 DTO
 */
export class PurchaseOrderItemDto {
  @ApiProperty({ description: '产品 ID' })
  @IsString()
  productId: string;

  @ApiProperty({ description: '产品名称' })
  @IsString()
  @MaxLength(200)
  productName: string;

  @ApiPropertyOptional({ description: '规格型号' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  specification?: string;

  @ApiProperty({ description: '采购单价' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ description: '采购数量' })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;
}

/**
 * 创建采购订单 DTO
 */
export class CreatePurchaseOrderDto {
  @ApiProperty({ description: '供应商 ID' })
  @IsString()
  supplierId: string;

  @ApiPropertyOptional({ description: '供应商名称' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  supplierName?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;

  @ApiPropertyOptional({ description: '订单日期' })
  @IsOptional()
  @IsDateString()
  orderDate?: Date;

  @ApiPropertyOptional({ description: '预计到货日期' })
  @IsOptional()
  @IsDateString()
  expectedDate?: Date;

  @ApiPropertyOptional({ description: '采购申请 ID' })
  @IsOptional()
  @IsString()
  purchaseRequestId?: string;

  @ApiProperty({ description: '订单明细列表' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseOrderItemDto)
  items: PurchaseOrderItemDto[];
}

/**
 * 更新采购订单状态 DTO
 */
export class UpdatePurchaseOrderStatusDto {
  @ApiProperty({ description: '状态', enum: ['draft', 'pending', 'approved', 'received', 'cancelled'] })
  @IsString()
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled';
}

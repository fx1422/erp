import { IsString, IsOptional, IsNumber, Min, IsArray, ValidateNested, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * 入库明细 DTO
 */
export class StockInItemDto {
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

  @ApiPropertyOptional({ description: '单位' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @ApiProperty({ description: '入库数量' })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({ description: '单价' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;

  @ApiPropertyOptional({ description: '批次号' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  batchNo?: string;
}

/**
 * 创建入库单 DTO
 */
export class CreateStockInDto {
  @ApiProperty({ description: '入库类型', enum: ['purchase', 'return', 'transfer', 'other'] })
  @IsString()
  type: 'purchase' | 'return' | 'transfer' | 'other';

  @ApiPropertyOptional({ description: '供应商 ID' })
  @IsOptional()
  @IsString()
  supplierId?: string;

  @ApiPropertyOptional({ description: '供应商名称' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  supplierName?: string;

  @ApiPropertyOptional({ description: '采购订单 ID' })
  @IsOptional()
  @IsString()
  purchaseOrderId?: string;

  @ApiPropertyOptional({ description: '仓库 ID' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  warehouseId?: string;

  @ApiPropertyOptional({ description: '仓库名称' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  warehouseName?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;

  @ApiPropertyOptional({ description: '入库日期' })
  @IsOptional()
  @IsDateString()
  inDate?: Date;

  @ApiPropertyOptional({ description: '创建人 ID' })
  @IsOptional()
  @IsString()
  createdById?: string;

  @ApiPropertyOptional({ description: '创建人姓名' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  createdBy?: string;

  @ApiProperty({ description: '入库明细列表' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockInItemDto)
  items: StockInItemDto[];
}

/**
 * 更新入库单状态 DTO
 */
export class UpdateStockInStatusDto {
  @ApiProperty({ description: '状态', enum: ['draft', 'pending', 'completed', 'cancelled'] })
  @IsString()
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
}

import { IsString, IsOptional, IsNumber, Min, IsArray, ValidateNested, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * 出库明细 DTO
 */
export class StockOutItemDto {
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

  @ApiProperty({ description: '出库数量' })
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
 * 创建出库单 DTO
 */
export class CreateStockOutDto {
  @ApiProperty({ description: '出库类型', enum: ['sales', 'return', 'transfer', 'other'] })
  @IsString()
  type: 'sales' | 'return' | 'transfer' | 'other';

  @ApiPropertyOptional({ description: '客户 ID' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({ description: '客户名称' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  customerName?: string;

  @ApiPropertyOptional({ description: '销售订单 ID' })
  @IsOptional()
  @IsString()
  salesOrderId?: string;

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

  @ApiPropertyOptional({ description: '出库日期' })
  @IsOptional()
  @IsDateString()
  outDate?: Date;

  @ApiPropertyOptional({ description: '创建人 ID' })
  @IsOptional()
  @IsString()
  createdById?: string;

  @ApiPropertyOptional({ description: '创建人姓名' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  createdBy?: string;

  @ApiProperty({ description: '出库明细列表' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockOutItemDto)
  items: StockOutItemDto[];
}

/**
 * 更新出库单状态 DTO
 */
export class UpdateStockOutStatusDto {
  @ApiProperty({ description: '状态', enum: ['draft', 'pending', 'completed', 'cancelled'] })
  @IsString()
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
}

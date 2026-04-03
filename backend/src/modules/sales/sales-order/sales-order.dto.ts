import { IsString, IsOptional, IsNumber, Min, IsArray, ValidateNested, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * 销售订单明细 DTO
 */
export class SalesOrderItemDto {
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

  @ApiProperty({ description: '销售单价' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ description: '销售数量' })
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
 * 创建销售订单 DTO
 */
export class CreateSalesOrderDto {
  @ApiProperty({ description: '客户 ID' })
  @IsString()
  customerId: string;

  @ApiPropertyOptional({ description: '客户名称' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  customerName?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;

  @ApiPropertyOptional({ description: '订单日期' })
  @IsOptional()
  @IsDateString()
  orderDate?: Date;

  @ApiPropertyOptional({ description: '交货日期' })
  @IsOptional()
  @IsDateString()
  deliveryDate?: Date;

  @ApiPropertyOptional({ description: '销售报价 ID' })
  @IsOptional()
  @IsString()
  quotationId?: string;

  @ApiProperty({ description: '订单明细列表' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalesOrderItemDto)
  items: SalesOrderItemDto[];
}

/**
 * 更新销售订单状态 DTO
 */
export class UpdateSalesOrderStatusDto {
  @ApiProperty({ description: '状态', enum: ['draft', 'pending', 'approved', 'shipped', 'completed', 'cancelled'] })
  @IsString()
  status: 'draft' | 'pending' | 'approved' | 'shipped' | 'completed' | 'cancelled';
}

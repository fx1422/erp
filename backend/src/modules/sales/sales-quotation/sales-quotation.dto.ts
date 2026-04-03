import { IsString, IsOptional, IsNumber, Min, IsArray, ValidateNested, MaxLength, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * 销售报价明细 DTO
 */
export class SalesQuotationItemDto {
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

  @ApiProperty({ description: '报价单价' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiProperty({ description: '数量' })
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
 * 创建销售报价 DTO
 */
export class CreateSalesQuotationDto {
  @ApiProperty({ description: '客户 ID' })
  @IsString()
  customerId: string;

  @ApiProperty({ description: '客户名称' })
  @IsString()
  @MaxLength(200)
  customerName: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;

  @ApiPropertyOptional({ description: '报价日期' })
  @IsOptional()
  @IsDateString()
  quotationDate?: Date;

  @ApiPropertyOptional({ description: '有效期至' })
  @IsOptional()
  @IsDateString()
  validUntil?: Date;

  @ApiProperty({ description: '报价明细列表' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalesQuotationItemDto)
  items: SalesQuotationItemDto[];
}

/**
 * 更新销售报价状态 DTO
 */
export class UpdateSalesQuotationStatusDto {
  @ApiProperty({ description: '状态', enum: ['draft', 'sent', 'accepted', 'rejected', 'expired', 'converted'] })
  @IsString()
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'converted';
}

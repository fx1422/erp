import { IsString, IsOptional, IsNumber, Min, IsArray, ValidateNested, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * 采购申请明细 DTO
 */
export class PurchaseRequestItemDto {
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

  @ApiProperty({ description: '申请数量' })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({ description: '单位' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @ApiPropertyOptional({ description: '预估单价' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  estimatedPrice?: number;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;
}

/**
 * 创建采购申请 DTO
 */
export class CreatePurchaseRequestDto {
  @ApiPropertyOptional({ description: '部门 ID' })
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional({ description: '部门名称' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  departmentName?: string;

  @ApiPropertyOptional({ description: '申请人 ID' })
  @IsOptional()
  @IsString()
  applicantId?: string;

  @ApiPropertyOptional({ description: '申请人姓名' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  applicantName?: string;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;

  @ApiPropertyOptional({ description: '需求日期' })
  @IsOptional()
  requiredDate?: Date;

  @ApiProperty({ description: '申请明细列表' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PurchaseRequestItemDto)
  items: PurchaseRequestItemDto[];
}

/**
 * 更新采购申请状态 DTO
 */
export class UpdatePurchaseRequestStatusDto {
  @ApiProperty({ description: '状态', enum: ['draft', 'pending', 'approved', 'rejected', 'converted'] })
  @IsString()
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'converted';

  @ApiPropertyOptional({ description: '审批人' })
  @IsOptional()
  @IsString()
  approvedBy?: string;
}

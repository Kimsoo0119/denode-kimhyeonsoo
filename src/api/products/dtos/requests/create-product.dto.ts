import { MaxLength } from 'class-validator';
import {
  IsLength,
  OptionalApiProperty,
  RequiredApiProperty,
} from '@shared/decorators';
import { PRODUCT_CONST } from '@shared/consts';

export class CreateProductDto {
  @RequiredApiProperty({
    description: '제품명',
    example: '아스피린 500mg',
    minLength: PRODUCT_CONST.MIN_NAME_LENGTH,
    maxLength: PRODUCT_CONST.MAX_NAME_LENGTH,
  })
  @IsLength(PRODUCT_CONST.MIN_NAME_LENGTH, PRODUCT_CONST.MAX_NAME_LENGTH)
  name: string;

  @OptionalApiProperty({
    description: '제품 설명',
    example: '해열진통제',
    required: false,
  })
  description?: string;
}

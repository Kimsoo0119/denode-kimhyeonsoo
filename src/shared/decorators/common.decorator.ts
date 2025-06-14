import { applyDecorators } from '@nestjs/common';
import {
  ApiProperty,
  ApiPropertyOptional,
  ApiPropertyOptions,
} from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export function RequiredApiProperty(options?: ApiPropertyOptions) {
  return applyDecorators(ApiProperty(options), IsNotEmpty());
}

export function OptionalApiProperty(options?: ApiPropertyOptions) {
  return applyDecorators(
    ApiPropertyOptional({ ...options, nullable: true }),
    IsOptional(),
  );
}

export function IsValidEnum(enumType: object) {
  return applyDecorators(
    IsEnum(enumType),
    Transform(({ value }) => value.toUpperCase()),
  );
}

export function ExposeApiProperty(options?: ApiPropertyOptions) {
  return applyDecorators(ApiProperty(options), Expose());
}

export function ExposeNullableApiProperty(options?: ApiPropertyOptions) {
  return applyDecorators(ApiProperty({ ...options, nullable: true }), Expose());
}

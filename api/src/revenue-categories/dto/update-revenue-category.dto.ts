import { PartialType } from '@nestjs/mapped-types';
import { CreateRevenueCategoryDto } from './create-revenue-category.dto';

export class UpdateRevenueCategoryDto extends PartialType(
  CreateRevenueCategoryDto,
) {}

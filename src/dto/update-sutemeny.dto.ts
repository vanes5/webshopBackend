import { PartialType } from '@nestjs/mapped-types';
import { CreateSutemenyDto } from './create-sutemeny.dto';

export class UpdateSutemenyDto extends PartialType(CreateSutemenyDto) {}


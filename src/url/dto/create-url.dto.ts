import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUrlDto {
  @ApiProperty()
  @IsUrl({}, { message: 'Invalid URL format' })
  url: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(4)
  @Matches(/^[a-zA-Z0-9-_]+$/, { message: 'Custom code must be alphanumeric' })
  customCode?: string;
}

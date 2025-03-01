import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @ApiProperty({
    example: "computer"
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @ApiProperty({
    example: "electronic device"
  })
  description: string;
}
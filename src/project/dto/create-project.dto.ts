import { IsString, IsNotEmpty, Length, IsDateString, IsOptional } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  description: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string | null;

  @IsNotEmpty()
  ownerId: number;

  @IsOptional()
  categoryId?: number;
}

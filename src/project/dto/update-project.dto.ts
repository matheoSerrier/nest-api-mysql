import { IsDateString, IsOptional, IsString, Length } from "class-validator";

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  description?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string | null;

  @IsOptional()
  categoryId?: number;
}

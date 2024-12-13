import { IsOptional, IsString, Length } from "class-validator";

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  description?: string;
}

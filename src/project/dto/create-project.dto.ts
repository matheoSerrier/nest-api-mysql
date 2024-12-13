import { IsString, IsNotEmpty, Length } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  description: string;

  @IsNotEmpty()
  ownerId: number;
}

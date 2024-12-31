import { IsOptional, IsString, IsEmail, Length } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  firstname?: string;

  @IsOptional()
  @IsString()
  @Length(3, 50)
  lastname?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

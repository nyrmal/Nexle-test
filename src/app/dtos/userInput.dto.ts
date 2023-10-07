import { IsEmail, Length, IsString } from 'class-validator';

export class UserInputDto {
  @IsEmail()
  @Length(1, 64)
  email: string;

  @IsString()
  @Length(8, 20)
  password: string;

  @IsString()
  @Length(1, 32)
  firstName: string;

  @IsString()
  @Length(1, 32)
  lastName: string;
}

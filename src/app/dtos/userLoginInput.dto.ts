import { IsEmail, Length, IsString } from 'class-validator';

export class UserLoginInputDto {
  @IsEmail()
  @Length(1, 64)
  email: string;

  @IsString()
  @Length(8, 20)
  password: string;
}

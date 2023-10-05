import { IsEmail, IsString, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserOuputDto {
  @IsNumber()
  @Expose()
  id: number;

  @IsString()
  @Expose()
  firstName: string;

  @IsString()
  @Expose()
  lastName: string;

  @IsEmail()
  @Expose()
  email: string;

  @IsString()
  @Expose()
  displayName: string;
}

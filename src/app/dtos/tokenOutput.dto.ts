import { IsEmail, IsString, IsNumber } from 'class-validator';
import { Expose } from 'class-transformer';

export class TokenOutputDto {
  @IsString()
  @Expose()
  token: string;

  @IsString()
  @Expose()
  refreshToken: string;
}

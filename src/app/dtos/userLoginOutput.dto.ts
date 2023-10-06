import { IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { UserOutputDto } from './userOutput.dto';

export class UserLoginOutputDto {
  @Expose()
  @Type(() => UserOutputDto)
  user: UserOutputDto;

  @IsString()
  @Expose()
  token: string;

  @IsString()
  @Expose()
  refreshToken: string;
}

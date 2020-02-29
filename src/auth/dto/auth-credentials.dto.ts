import { IsString, Matches, MaxLength, MinLength } from 'class-validator';


const matches = Matches(
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  { message: 'password too weak' },
);

export class AuthCredentialsDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @matches
  password: string;

}
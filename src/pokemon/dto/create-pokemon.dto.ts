import {IsInt, IsNotEmpty, IsString, IsPositive} from 'class-validator'

export class CreatePokemonDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  no:number;

  @IsString()
  @IsNotEmpty()
  name: string
}

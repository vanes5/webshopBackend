import { IsNotEmpty, IsString } from "class-validator";

export class CreateProfileDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
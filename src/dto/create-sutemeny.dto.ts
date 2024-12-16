import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSutemenyDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    @IsString()
    description: string;
}
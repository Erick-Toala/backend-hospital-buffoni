import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsNumber, IsPositive, IsDateString, Length, Matches } from 'class-validator';
import { Genero } from '@prisma/client';

export class CreatePacienteDto {
    @ApiProperty({
        example: 'Erick Alexander',
        description: 'Nombres del paciente'
    })
    @IsString()
    @IsNotEmpty({ message: 'Los nombres son obligatorios' })
    @Length(2, 100, { message: 'Los nombres deben tener entre 2 y 100 caracteres' })
    nombres: string;

    @ApiProperty({
        example: 'Toala Intriago',
        description: 'Apellidos del paciente'
    })
    @IsString()
    @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
    @Length(2, 100, { message: 'Los apellidos deben tener entre 2 y 100 caracteres' })
    apellidos: string;

    @ApiProperty({
        example: '0123456789',
        description: 'Cédula de identidad del paciente (única)'
    })
    @IsString()
    @IsNotEmpty({ message: 'La cédula es obligatoria' })
    @Length(10, 10, { message: 'La cédula debe tener exactamente 10 dígitos' })
    @Matches(/^[0-9]+$/, { message: 'La cédula solo debe contener números' })
    cedula: string;

    @ApiProperty({
        example: '2001-11-28',
        description: 'Fecha de nacimiento del paciente (YYYY-MM-DD)'
    })
    @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)' })
    @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
    fechaNacimiento: string;

    @ApiProperty({
        enum: Genero,
        example: Genero.MASCULINO,
        description: 'Género del paciente'
    })
    @IsEnum(Genero, { message: 'El género debe ser MASCULINO, FEMENINO u OTRO' })
    @IsNotEmpty({ message: 'El género es obligatorio' })
    genero: Genero;

    @ApiProperty({
        example: '0987654321',
        description: 'Teléfono de contacto',
        required: false
    })
    @IsString()
    @IsOptional()
    @Length(7, 15, { message: 'El teléfono debe tener entre 7 y 15 caracteres' })
    telefono?: string;

    @ApiProperty({
        example: 'paciente.ejemplo@gmail.com',
        description: 'Email del paciente',
        required: false
    })
    @IsEmail({}, { message: 'El email debe ser válido' })
    @IsOptional()
    email?: string;

    @ApiProperty({
        example: 'Av. Circunvalación, Manta, Ecuador',
        description: 'Dirección del paciente',
        required: false
    })
    @IsString()
    @IsOptional()
    @Length(5, 200, { message: 'La dirección debe tener entre 5 y 200 caracteres' })
    direccion?: string;

    @ApiProperty({
        example: 70.5,
        description: 'Peso del paciente en kilogramos'
    })
    @IsNumber({}, { message: 'El peso debe ser un número' })
    @IsPositive({ message: 'El peso debe ser un número positivo' })
    @IsNotEmpty({ message: 'El peso es obligatorio' })
    peso: number;

    @ApiProperty({
        example: 176,
        description: 'Altura del paciente en centímetros'
    })
    @IsNumber({}, { message: 'La altura debe ser un número' })
    @IsPositive({ message: 'La altura debe ser un número positivo' })
    @IsNotEmpty({ message: 'La altura es obligatoria' })
    altura: number;
}
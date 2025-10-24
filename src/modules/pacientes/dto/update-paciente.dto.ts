import { PartialType } from '@nestjs/swagger';
import { CreatePacienteDto } from './create-paciente.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EstadoPaciente } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {
    @ApiProperty({
        enum: EstadoPaciente,
        example: EstadoPaciente.ACTIVO,
        description: 'Estado del paciente',
        required: false
    })
    @IsEnum(EstadoPaciente, { message: 'El estado debe ser ACTIVO o INACTIVO' })
    @IsOptional()
    estado?: EstadoPaciente;
}
import { ApiProperty } from '@nestjs/swagger';
import { Genero, EstadoPaciente } from '@prisma/client';

export class PacienteEntity {
    @ApiProperty({ example: 'uuid-123-456' })
    id: string;

    @ApiProperty({ example: 'Erick Toala' })
    nombres: string;

    @ApiProperty({ example: 'Toala Intriago' })
    apellidos: string;

    @ApiProperty({ example: '1234567890' })
    cedula: string;

    @ApiProperty({ example: '2001-11-28T00:00:00.000Z' })
    fechaNacimiento: Date;

    @ApiProperty({ enum: Genero, example: Genero.MASCULINO })
    genero: Genero;

    @ApiProperty({ example: '0987654321', required: false })
    telefono: string | null;

    @ApiProperty({ example: 'paciente.ejemplo@gmail.com', required: false })
    email: string | null;

    @ApiProperty({ example: 'Av. Circunvalación, Manta, Ecuador', required: false })
    direccion: string | null;

    @ApiProperty({ example: 70.5 })
    peso: number;

    @ApiProperty({ example: 175 })
    altura: number;

    @ApiProperty({ enum: EstadoPaciente, example: EstadoPaciente.ACTIVO })
    estado: EstadoPaciente;

    @ApiProperty({ example: '2024-10-23T10:30:00.000Z' })
    fechaRegistro: Date;

    @ApiProperty({ example: '2024-10-23T10:30:00.000Z' })
    fechaActualizacion: Date;

    // Propiedades calculadas
    @ApiProperty({ example: 34, description: 'Edad calculada en años' })
    edad?: number;

    @ApiProperty({ example: 23.02, description: 'IMC calculado (peso/altura²)' })
    imc?: number;
}
// src/modules/pacientes/pacientes.service.ts
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePacienteDto, UpdatePacienteDto } from './dto';
import { Paciente } from '@prisma/client';

@Injectable()
export class PacientesService {
    constructor(private prisma: PrismaService) { }

    /**
     * Crear un nuevo paciente
     */
    async create(createPacienteDto: CreatePacienteDto): Promise<Paciente> {
        // Verificar si la cédula ya existe
        const existePaciente = await this.prisma.paciente.findUnique({
            where: { cedula: createPacienteDto.cedula },
        });

        if (existePaciente) {
            throw new ConflictException(`Ya existe un paciente con la cédula ${createPacienteDto.cedula}`);
        }

        try {
            const paciente = await this.prisma.paciente.create({
                data: {
                    ...createPacienteDto,
                    fechaNacimiento: new Date(createPacienteDto.fechaNacimiento),
                },
            });

            return paciente;
        } catch (error) {
            throw new BadRequestException('Error al crear el paciente');
        }
    }

    /**
     * Obtener todos los pacientes con paginación
     */
    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [pacientes, total] = await Promise.all([
            this.prisma.paciente.findMany({
                skip,
                take: limit,
                orderBy: { fechaRegistro: 'desc' },
            }),
            this.prisma.paciente.count(),
        ]);

        return {
            data: pacientes.map(p => this.agregarCalculos(p)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    /**
     * Obtener un paciente por ID
     */
    async findOne(id: string): Promise<Paciente> {
        const paciente = await this.prisma.paciente.findUnique({
            where: { id },
        });

        if (!paciente) {
            throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
        }

        return this.agregarCalculos(paciente);
    }

    /**
     * Buscar paciente por cédula
     */
    async findByCedula(cedula: string): Promise<Paciente> {
        const paciente = await this.prisma.paciente.findUnique({
            where: { cedula },
        });

        if (!paciente) {
            throw new NotFoundException(`Paciente con cédula ${cedula} no encontrado`);
        }

        return this.agregarCalculos(paciente);
    }

    /**
     * Buscar pacientes por nombre o apellido
     */
    async search(query: string, page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [pacientes, total] = await Promise.all([
            this.prisma.paciente.findMany({
                where: {
                    OR: [
                        { nombres: { contains: query, mode: 'insensitive' } },
                        { apellidos: { contains: query, mode: 'insensitive' } },
                        { cedula: { contains: query } },
                    ],
                },
                skip,
                take: limit,
                orderBy: { fechaRegistro: 'desc' },
            }),
            this.prisma.paciente.count({
                where: {
                    OR: [
                        { nombres: { contains: query, mode: 'insensitive' } },
                        { apellidos: { contains: query, mode: 'insensitive' } },
                        { cedula: { contains: query } },
                    ],
                },
            }),
        ]);

        return {
            data: pacientes.map(p => this.agregarCalculos(p)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                query,
            },
        };
    }

    /**
     * Actualizar un paciente
     */
    async update(id: string, updatePacienteDto: UpdatePacienteDto): Promise<Paciente> {
        // Verificar que el paciente existe
        await this.findOne(id);

        // Si se intenta actualizar la cédula, verificar que no exista
        if (updatePacienteDto.cedula) {
            const existePaciente = await this.prisma.paciente.findFirst({
                where: {
                    cedula: updatePacienteDto.cedula,
                    NOT: { id },
                },
            });

            if (existePaciente) {
                throw new ConflictException(`Ya existe otro paciente con la cédula ${updatePacienteDto.cedula}`);
            }
        }

        try {
            const dataToUpdate: any = { ...updatePacienteDto };

            // Convertir fecha si viene en el DTO
            if (updatePacienteDto.fechaNacimiento) {
                dataToUpdate.fechaNacimiento = new Date(updatePacienteDto.fechaNacimiento);
            }

            const paciente = await this.prisma.paciente.update({
                where: { id },
                data: dataToUpdate,
            });

            return this.agregarCalculos(paciente);
        } catch (error) {
            throw new BadRequestException('Error al actualizar el paciente');
        }
    }

    /**
     * Eliminar un paciente (soft delete)
     */
    async remove(id: string): Promise<{ message: string }> {
        await this.findOne(id);

        await this.prisma.paciente.update({
            where: { id },
            data: { estado: 'INACTIVO' },
        });

        return { message: `Paciente con ID ${id} ha sido desactivado exitosamente` };
    }

    /**
     * Eliminar permanentemente un paciente
     */
    async hardDelete(id: string): Promise<{ message: string }> {
        await this.findOne(id);

        await this.prisma.paciente.delete({
            where: { id },
        });

        return { message: `Paciente con ID ${id} ha sido eliminado permanentemente` };
    }

    /**
     * Método privado para agregar cálculos (edad, IMC)
     */
    private agregarCalculos(paciente: Paciente): any {
        const edad = this.calcularEdad(paciente.fechaNacimiento);
        const imc = this.calcularIMC(paciente.peso, paciente.altura);

        return {
            ...paciente,
            edad,
            imc: parseFloat(imc.toFixed(2)),
        };
    }

    /**
     * Calcular edad en años
     */
    private calcularEdad(fechaNacimiento: Date): number {
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }

        return edad;
    }

    /**
     * Calcular IMC (Índice de Masa Corporal)
     * IMC = peso (kg) / (altura (m))²
     */
    private calcularIMC(peso: number, altura: number): number {
        const alturaEnMetros = altura / 100;
        return peso / (alturaEnMetros * alturaEnMetros);
    }
}
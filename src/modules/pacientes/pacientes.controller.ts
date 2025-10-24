import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
    ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto, UpdatePacienteDto } from './dto';
import { PacienteEntity } from './entities/paciente.entity';

@ApiTags('pacientes')
@Controller('pacientes')
export class PacientesController {
    constructor(private readonly pacientesService: PacientesService) { }

    /**
     * Crear un nuevo paciente
     */
    @Post()
    @ApiOperation({ summary: 'Crear un nuevo paciente' })
    @ApiResponse({
        status: 201,
        description: 'Paciente creado exitosamente',
        type: PacienteEntity,
    })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos',
    })
    @ApiResponse({
        status: 409,
        description: 'La cédula ya existe',
    })
    async create(@Body() createPacienteDto: CreatePacienteDto) {
        return this.pacientesService.create(createPacienteDto);
    }

    /**
     * Obtener todos los pacientes con paginación
     */
    @Get()
    @ApiOperation({ summary: 'Obtener todos los pacientes con paginación' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Lista de pacientes obtenida exitosamente',
    })
    async findAll(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ) {
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        return this.pacientesService.findAll(pageNumber, limitNumber);
    }

    /**
     * Buscar pacientes por nombre, apellido o cédula
     */
    @Get('search')
    @ApiOperation({ summary: 'Buscar pacientes por nombre, apellido o cédula' })
    @ApiQuery({ name: 'q', required: true, type: String, example: 'Erick' })
    @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
    @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
    @ApiResponse({
        status: 200,
        description: 'Resultados de búsqueda obtenidos exitosamente',
    })
    async search(
        @Query('q') query: string,
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10',
    ) {
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        return this.pacientesService.search(query, pageNumber, limitNumber);
    }

    /**
     * Buscar paciente por cédula
     */
    @Get('cedula/:cedula')
    @ApiOperation({ summary: 'Buscar paciente por cédula' })
    @ApiParam({ name: 'cedula', type: String, example: '1234567890' })
    @ApiResponse({
        status: 200,
        description: 'Paciente encontrado',
        type: PacienteEntity,
    })
    @ApiResponse({
        status: 404,
        description: 'Paciente no encontrado',
    })
    async findByCedula(@Param('cedula') cedula: string) {
        return this.pacientesService.findByCedula(cedula);
    }

    /**
     * Obtener un paciente por ID
     */
    @Get(':id')
    @ApiOperation({ summary: 'Obtener un paciente por ID' })
    @ApiParam({ name: 'id', type: String, format: 'uuid' })
    @ApiResponse({
        status: 200,
        description: 'Paciente encontrado',
        type: PacienteEntity,
    })
    @ApiResponse({
        status: 404,
        description: 'Paciente no encontrado',
    })
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.pacientesService.findOne(id);
    }

    /**
     * Actualizar un paciente
     */
    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un paciente' })
    @ApiParam({ name: 'id', type: String, format: 'uuid' })
    @ApiResponse({
        status: 200,
        description: 'Paciente actualizado exitosamente',
        type: PacienteEntity,
    })
    @ApiResponse({
        status: 404,
        description: 'Paciente no encontrado',
    })
    @ApiResponse({
        status: 409,
        description: 'La cédula ya existe',
    })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updatePacienteDto: UpdatePacienteDto,
    ) {
        return this.pacientesService.update(id, updatePacienteDto);
    }

    /**
     * Desactivar un paciente
     */
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Desactivar un paciente' })
    @ApiParam({ name: 'id', type: String, format: 'uuid' })
    @ApiResponse({
        status: 200,
        description: 'Paciente desactivado exitosamente',
    })
    @ApiResponse({
        status: 404,
        description: 'Paciente no encontrado',
    })
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.pacientesService.remove(id);
    }

    /**
     * Eliminar permanentemente un paciente
     */
    @Delete(':id/hard')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar permanentemente un paciente' })
    @ApiParam({ name: 'id', type: String, format: 'uuid' })
    @ApiResponse({
        status: 200,
        description: 'Paciente eliminado permanentemente',
    })
    @ApiResponse({
        status: 404,
        description: 'Paciente no encontrado',
    })
    async hardDelete(@Param('id', ParseUUIDPipe) id: string) {
        return this.pacientesService.hardDelete(id);
    }
}
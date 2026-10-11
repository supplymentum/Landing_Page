import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateExecutiveDto } from './dto/create-executive.dto';
import { UpdateExecutiveDto } from './dto/update-executive.dto';
import { ExecutivesService } from './executives.service';

@ApiTags('Administración - Directivos')
@UseGuards(JwtAuthGuard)
@Controller('admin/executives')
export class AdminExecutivesController {
  constructor(private readonly executivesService: ExecutivesService) {}

  @ApiOperation({
    summary: 'Obtener todos los directivos',
    description:
      'Retorna todos los directivos registrados en el CMS, incluyendo los que se encuentran desactivados.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de directivos obtenida correctamente.',
  })
  @Get()
  findAll() {
    return this.executivesService.findAdminAll();
  }

  @ApiOperation({
    summary: 'Obtener un directivo por ID',
    description:
      'Retorna un directivo registrado en el CMS independientemente de si se encuentra activo o inactivo.',
  })
  @ApiParam({
    name: 'executiveId',
    description: 'ID del directivo',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Directivo obtenido correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró un directivo con el ID especificado.',
  })
  @Get(':executiveId')
  findOne(
    @Param('executiveId', ParseIntPipe)
    executiveId: number,
  ) {
    return this.executivesService.findAdminOne(executiveId);
  }

  @ApiOperation({
    summary: 'Crear un directivo',
    description:
      'Registra un nuevo directivo dentro de la organización.',
  })
  @ApiBody({
    type: CreateExecutiveDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Directivo creado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Los datos enviados son inválidos o el rol/área especificado no existe.',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un directivo con esos datos.',
  })
  @Post()
  create(@Body() createExecutiveDto: CreateExecutiveDto) {
    return this.executivesService.create(createExecutiveDto);
  }

  @ApiOperation({
    summary: 'Actualizar un directivo',
    description:
      'Actualiza parcialmente la información de un directivo existente.',
  })
  @ApiParam({
    name: 'executiveId',
    description: 'ID del directivo',
    type: Number,
    example: 1,
  })
  @ApiBody({
    type: UpdateExecutiveDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Directivo actualizado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Los datos enviados son inválidos o no se proporcionó ningún campo para actualizar.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró un directivo con el ID especificado.',
  })
  @ApiResponse({
    status: 409,
    description: 'Ya existe un directivo con esos datos.',
  })
  @Patch(':executiveId')
  update(
    @Param('executiveId', ParseIntPipe)
    executiveId: number,
    @Body() updateExecutiveDto: UpdateExecutiveDto,
  ) {
    return this.executivesService.update(
      executiveId,
      updateExecutiveDto,
    );
  }

  @ApiOperation({
    summary: 'Desactivar un directivo',
    description:
      'Desactiva un directivo mediante un soft delete. El registro permanece almacenado en la base de datos.',
  })
  @ApiParam({
    name: 'executiveId',
    description: 'ID del directivo',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Directivo desactivado correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró un directivo con el ID especificado.',
  })
  @Delete(':executiveId')
  remove(
    @Param('executiveId', ParseIntPipe)
    executiveId: number,
  ) {
    return this.executivesService.remove(executiveId);
  }
}
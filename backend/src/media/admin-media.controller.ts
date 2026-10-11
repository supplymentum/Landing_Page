import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileTypeValidator } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DeleteMediaDto } from './dto/delete-media.dto';
import { UploadMediaDto } from './dto/upload-media.dto';
import { MediaService } from './media.service';

@ApiTags('Admin - Multimedia')
@ApiCookieAuth('admin_token')
@UseGuards(JwtAuthGuard)
@Controller('admin/media')
export class AdminMediaController {
  constructor(private readonly mediaService: MediaService) {}

  @ApiOperation({
    summary: 'Upload an image to CMS storage',
    description:
      'Uploads a JPEG, PNG, or WebP image to Supabase Storage and returns its path and public URL.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'resource'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image to upload',
        },
        resource: {
          type: 'string',
          enum: ['areas', 'events', 'executives', 'projects'],
          description: 'Type of resource the image belongs to',
          example: 'executives',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully.',
    schema: {
      example: {
        image_path: 'executives/3d9d5fe5-7c4a-4d17-bfe9-242af161ef2b.webp',
        image_url:
          'https://xyz.supabase.co/storage/v1/object/public/cms-media/executives/3d9d5fe5-7c4a-4d17-bfe9-242af161ef2b.webp',
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post()
  upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024,
          }),

          new FileTypeValidator({
            fileType: /^image\/(jpeg|png|webp)$/,
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,

    @Body()
    uploadMediaDto: UploadMediaDto,
  ) {
    return this.mediaService.upload(file, uploadMediaDto.resource);
  }

  @ApiOperation({
    summary: 'Delete an image from CMS storage',
    description: 'Deletes an image stored in the multimedia content bucket.',
  })
  @ApiBody({
    type: DeleteMediaDto,
    examples: {
      example1: {
        value: {
          image_path: 'executives/johan-osores.webp',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Image deleted successfully.',
    schema: {
      example: {
        message: 'Image deleted successfully',
        image_path: 'executives/johan-osores.webp',
      },
    },
  })
  @ApiOperation({
    summary: 'Get the public URL of a CMS image',
    description:
      'Returns the public URL corresponding to an image path stored in the CMS media bucket.',
  })
  @ApiResponse({
    status: 200,
    description: 'Public image URL returned successfully.',
    schema: {
      example: {
        image_path: 'executives/3d9d5fe5-7c4a-4d17-bfe9-242af161ef2b.webp',
        image_url:
          'https://xyz.supabase.co/storage/v1/object/public/cms-media/executives/3d9d5fe5-7c4a-4d17-bfe9-242af161ef2b.webp',
      },
    },
  })
  @ApiOperation({
    summary: 'List CMS media files',
    description:
      'Returns the images stored in the CMS media bucket. It can optionally filter by resource.',
  })
  @ApiResponse({
    status: 200,
    description: 'Media files returned successfully.',
    schema: {
      example: [
        {
          name: '3d9d5fe5-7c4a-4d17-bfe9-242af161ef2b.webp',
          image_path: 'executives/3d9d5fe5-7c4a-4d17-bfe9-242af161ef2b.webp',
          image_url:
            'https://xyz.supabase.co/storage/v1/object/public/cms-media/executives/3d9d5fe5-7c4a-4d17-bfe9-242af161ef2b.webp',
          resource: 'executives',
          created_at: '2026-08-22T18:30:00.000Z',
          updated_at: '2026-08-22T18:30:00.000Z',
          size: 241832,
          mime_type: 'image/webp',
        },
      ],
    },
  })
  @Get()
  findAll(
    @Query('resource')
    resource?: string,
  ) {
    return this.mediaService.findAll(resource);
  }
  @Get('url')
  getPublicUrl(
    @Query('image_path')
    imagePath: string,
  ) {
    return {
      image_path: imagePath,
      image_url: this.mediaService.getPublicUrl(imagePath),
    };
  }
  @Delete()
  remove(
    @Body()
    deleteMediaDto: DeleteMediaDto,
  ) {
    return this.mediaService.remove(deleteMediaDto.image_path);
  }
}

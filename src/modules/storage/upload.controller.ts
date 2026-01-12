import {
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StorageService } from './storage.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
    constructor(private readonly storageService: StorageService) { }

    @ApiOperation({
        summary: 'Upload image api to get url',
    })
    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Upload an image file',
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    async uploadImage(@UploadedFile() file: any) {
        return await this.storageService.uploadFile(file);
    }
}

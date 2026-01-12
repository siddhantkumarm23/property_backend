import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { UploadController } from './upload.controller';

@Module({
    providers: [StorageService],
    exports: [StorageService],
    controllers: [UploadController],
})
export class StorageModule { }
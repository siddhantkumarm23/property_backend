import { Storage } from '@google-cloud/storage';
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as path from 'path';
import * as uuid from 'uuid';

@Injectable()
export class StorageService {

    constructor(private readonly configService: ConfigService) { }

    private storage = new Storage({
        projectId: this.configService.get<string>('GCP_PROJECT_ID'),
        credentials: {
            project_id: this.configService.get<string>('GCP_PROJECT_ID'),
            client_email: this.configService.get<string>('GCP_CLIENT_EMIL'),
            private_key: this.configService.get<string>('GCP_PRIVATE_KEY').split(String.raw`\n`).join('\n')
        }
    });

    private bucket = this.storage.bucket(this.configService.get<string>('GCP_BUCKET_NAME'));


    async uploadFile(file: any) {
        const fileExt = path.extname(file.originalname || file.name);
        const fileName = `${uuid.v4()}${fileExt}`;

        const blob = this.bucket.file(fileName);
        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file.mimetype,
            public: true,
        });

        return new Promise((resolve, reject) => {
            blobStream.on('finish', async () => {
                const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;
                resolve({ fileName, url: publicUrl });
            });

            blobStream.on('error', (error) => reject(error));

            blobStream.end(file.buffer);
        });
    }




}
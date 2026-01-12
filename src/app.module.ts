import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GcpService } from './common/gcp.service';
import { PropertyModule } from './modules/property/property.module';
import { StayModule } from './modules/stay/stay.module';
import { StorageModule } from './modules/storage/storage.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('DB_STRING');
        return {
          uri,
          connectionFactory: (connection) => {
            connection.set('debug', true);
            connection.once('open', () => {
              Logger.log('✅ MongoDB Connected Successfully', 'MongoDB');
            });

            connection.on('error', (err) => {
              Logger.error('❌ MongoDB Connection Error: ' + err, 'MongoDB');
            });

            return connection;
          },
        };
      },
    }),

    UserModule,
    StorageModule,
    PropertyModule,
    StayModule
  ],
  controllers: [AppController],
  providers: [AppService, GcpService],
})
export class AppModule { }

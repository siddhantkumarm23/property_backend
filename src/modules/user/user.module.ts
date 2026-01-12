import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GcpService } from 'src/common/gcp.service';
import { Stay, StaySchema } from '../stay/entities/stay.entity';
import { StayModule } from '../stay/stay.module';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Stay.name, schema: StaySchema },
    ]),
    StayModule,
  ],
  controllers: [UserController, AuthController],
  providers: [UserService, GcpService],
  exports: [UserService],
})
export class UserModule { }

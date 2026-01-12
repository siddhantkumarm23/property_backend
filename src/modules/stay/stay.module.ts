import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyModule } from '../property/property.module';
import { User, UserSchema } from '../user/entities/user.entity';
import { Stay, StaySchema } from './entities/stay.entity';
import { StayController } from './stay.controller';
import { StayService } from './stay.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Stay.name, schema: StaySchema },
      { name: User.name, schema: UserSchema },
    ]),
    PropertyModule,
  ],
  controllers: [StayController],
  providers: [StayService],
  exports: [StayService],
})
export class StayModule { }

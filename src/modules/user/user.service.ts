import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { StayService } from '../stay/stay.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, UserRole } from './entities/user.entity';
import { UserType } from './user.types';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly stayService: StayService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    switch (createUserDto.role) {
      case UserRole.ADMIN:
        if (
          createUserDto.password !== undefined &&
          createUserDto.password !== null &&
          createUserDto.password != ''
        ) {
          const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
          // Replace plain password
          createUserDto.password = hashedPassword;
        } else {
          throw new BadRequestException('For admin role password is required');
        }
        break;
      case UserRole.USER:
        const findStay = await this.stayService.findOneStay(
          createUserDto.stayId,
        );
        if (!findStay) {
          throw new BadRequestException('Invalid stay Id');
        }
    }
    const newUser = new this.userModel(createUserDto);
    return await newUser.save();
  }

  async login(authLoginDto: AuthLoginDto) {
    const findUserByEmail: UserType = await this.userModel.findOne({
      email: authLoginDto.email,
    });
    const isPasswordMatched = await bcrypt.compare(
      authLoginDto.password,
      findUserByEmail.password,
    );
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid password!');
    }
    const returnUser = findUserByEmail;
    delete returnUser.password;
    return returnUser;
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    switch (updateUserDto.role) {
      case UserRole.ADMIN:
        if (
          updateUserDto.password !== undefined &&
          updateUserDto.password !== null &&
          updateUserDto.password != ''
        ) {
          const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
          // Replace plain password
          updateUserDto.password = hashedPassword;
        } else {
          throw new BadRequestException('For admin role password is required');
        }
        break;
      case UserRole.USER:
        const findStay = await this.stayService.findOneStay(
          updateUserDto.stayId,
        );
        if (!findStay) {
          throw new BadRequestException('Invalid stay Id');
        }
    }
    const newUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true, // return updated document
    });
    return newUser;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

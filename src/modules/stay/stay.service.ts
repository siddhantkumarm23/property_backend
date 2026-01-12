import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';
import { Model, Types } from 'mongoose';
import { PropertyService } from '../property/property.service';
import { CreateStayDto } from './dto/create-stay.dto';
import { UpdateStayDto } from './dto/update-stay.dto';
import { Stay, StayDocument } from './entities/stay.entity';

@Injectable()
export class StayService {
  constructor(
    @InjectModel(Stay.name)
    private readonly stayModel: Model<StayDocument>,
    private readonly propertyService: PropertyService,
  ) { }

  async create(createStayDto: CreateStayDto) {
    const getPropertyDetails = await this.propertyService.findOne(
      createStayDto.propertyId,
    );
    if (!getPropertyDetails) {
      throw new BadRequestException('Property not found!');
    }
    const start = moment(createStayDto.startDate, 'MM/DD/YYYY', true);
    const end = moment(createStayDto.endDate, 'MM/DD/YYYY', true);

    if (!start.isValid() || !end.isValid()) {
      throw new BadRequestException('Invalid date format. Use MM/DD/YYYY');
    }

    const stayProperty = {
      ...createStayDto,
      startDate: start.toDate(),
      endDate: end.toDate(),
    };
    const newStay = await new this.stayModel(stayProperty);
    return await newStay.save();
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const stays = await this.stayModel.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'properties', // collection name in Mongo
          localField: 'propertyId',
          foreignField: '_id',
          as: 'property',
        },
      },
      {
        $unwind: {
          path: '$property',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    const total = await this.stayModel.countDocuments();

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: stays,
    };
  }

  async findOne(id: string) {
    const stays = await this.stayModel.aggregate([
      { $match: { _id: new Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'properties', // collection name in Mongo
          localField: 'propertyId',
          foreignField: '_id',
          as: 'property',
        },
      },
      {
        $unwind: {
          path: '$property',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id', // stay _id
          foreignField: 'stayId', // users.stayId
          as: 'users',
        },
      },
    ]);
    return stays[0];
  }

  async findOneStay(id: string) {
    const stays = await this.stayModel.findById(id);
    return stays;
  }

  async update(id: string, updateStayDto: UpdateStayDto) {
    const getPropertyDetails = await this.propertyService.findOne(
      updateStayDto.propertyId,
    );
    if (!getPropertyDetails) {
      throw new BadRequestException('Property not found!');
    }
    const stayProperty: any = {
      ...updateStayDto,
      startDate: moment(updateStayDto.startDate, 'DD/MM/YYYY', true).toDate(),
      endDate: moment(updateStayDto.endDate, 'DD/MM/YYYY', true).toDate(),
    };

    const updateStay = await this.stayModel.findByIdAndUpdate(
      id,
      { ...updateStayDto },
      {
        new: true, // return updated document
        runValidators: true, // ensures DTO + schema validation runs
      },
    );
    return updateStay;
  }

  async remove(id: string) {
    const updateStay = await this.stayModel.findByIdAndUpdate(
      id,
      { isActive: false },
      {
        new: true, // return updated document
        runValidators: true, // ensures DTO + schema validation runs
      },
    );
    if (!updateStay) {
      throw new NotFoundException(`Stay with ID ${id} not found`);
    }
    return updateStay;
  }
}

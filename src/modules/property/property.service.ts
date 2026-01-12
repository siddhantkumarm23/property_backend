import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Property, PropertyDocument } from './entities/property.entity';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name)
    private readonly propertyModel: Model<PropertyDocument>,
  ) { }

  async create(createPropertyDto: CreatePropertyDto) {
    createPropertyDto.image =
      createPropertyDto.image != null && createPropertyDto.image != ''
        ? createPropertyDto.image
        : 'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg';
    const newProperty = new this.propertyModel(createPropertyDto);
    return await newProperty.save();
  }

  async findAll() {
    const result = await this.propertyModel.aggregate([
      // 1️⃣ Match active properties (optional)
      {
        $match: { isActive: true },
      },

      // 2️⃣ Lookup stays for each property
      {
        $lookup: {
          from: 'stays', // stay collection name
          localField: '_id', // property _id
          foreignField: 'propertyId',
          as: 'stays',
        },
      },

      // 3️⃣ Add stayCount field
      {
        $addFields: {
          stayCount: { $size: '$stays' },
        },
      },

      // 4️⃣ Remove stays array if not needed
      {
        $project: {
          stays: 0,
        },
      },
    ]);

    return result;
  }

  async findOne(id: string) {
    const property = await this.propertyModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(id),
          isActive: true,
        },
      },

      {
        $lookup: {
          from: 'stays',
          localField: '_id',
          foreignField: 'propertyId',
          as: 'stays',
        },
      },

      {
        $lookup: {
          from: 'users',
          let: { stayIds: '$stays._id' },
          pipeline: [
            {
              $match: {
                $expr: { $in: ['$stayId', '$$stayIds'] },
              },
            },
            {
              $group: {
                _id: '$stayId',
                userCount: { $sum: 1 },
              },
            },
          ],
          as: 'userCounts',
        },
      },

      {
        $addFields: {
          stays: {
            $map: {
              input: '$stays',
              as: 'stay',
              in: {
                $mergeObjects: [
                  '$$stay',
                  {
                    userCount: {
                      $let: {
                        vars: {
                          matched: {
                            $arrayElemAt: [
                              {
                                $filter: {
                                  input: '$userCounts',
                                  as: 'uc',
                                  cond: { $eq: ['$$uc._id', '$$stay._id'] },
                                },
                              },
                              0,
                            ],
                          },
                        },
                        in: { $ifNull: ['$$matched.userCount', 0] },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },

      {
        $project: {
          userCounts: 0,
        },
      },
    ]);

    return property[0];
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto) {
    const updated = await this.propertyModel.findByIdAndUpdate(
      id,
      { ...updatePropertyDto },
      {
        new: true, // return updated document
        runValidators: true, // ensures DTO + schema validation runs
      },
    );

    if (!updated) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return updated;
  }

  async remove(id: string) {
    const updated = await this.propertyModel.findByIdAndUpdate(
      id,
      { isActive: false },
      {
        new: true, // return updated document
        runValidators: true, // ensures DTO + schema validation runs
      },
    );

    if (!updated) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return updated;
  }
}

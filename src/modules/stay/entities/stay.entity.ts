import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type StayDocument = Stay & Document;

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.__v;
        }
    }
})

export class Stay {
    @Prop({
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 150,
        index: true,
    })
    name: string;

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true })
    propertyId: string;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;
}

export const StaySchema = SchemaFactory.createForClass(Stay);

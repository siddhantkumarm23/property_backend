import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PropertyDocument = Property & Document;

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.__v;
        }
    }
})


export class Property {

    @Prop({
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 500,
        index: true,
    })
    name: string;

    @Prop({
        required: true,
        trim: true,
        minlength: 2,
    })
    address: string;

    @Prop({ required: false, trim: true })
    image?: string;

    @Prop({
        type: Boolean,
        default: true
    })
    isActive: boolean

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

}
export const PropertySchema = SchemaFactory.createForClass(Property);
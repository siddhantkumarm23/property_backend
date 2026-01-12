import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

@Schema({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret.__v;
        },
    },
})
export class User {
    @Prop({
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    })
    fName: string;

    @Prop({
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
    })
    lName: string;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    email: string;

    @Prop({
        required: false,
        minlength: 6,
    })
    password: string;

    @Prop({
        required: true,
        minlength: 3,
    })
    countryCode: string;

    @Prop({
        required: true,
        validate: {
            validator: (v: number) => v.toString().length === 10,
            message: 'Mobile number must be exactly 10 digits',
        },
    })
    mobile: number;

    @Prop({
        type: String,
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @Prop({ required: false, trim: true })
    image?: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Stay', required: false })
    stayId: string;

    @Prop({
        type: Boolean,
        default: true,
    })
    isActive: boolean;

    @Prop({
        type: Boolean,
        default: false,
    })
    isPrimaryUser: boolean;

    createdAt: Date;
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

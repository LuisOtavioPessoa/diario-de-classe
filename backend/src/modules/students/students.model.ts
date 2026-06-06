import {Schema, Types, model, HydratedDocument} from "mongoose";

export interface IStudent{
    name: string;
    birthDate: Date;
    gender: 'male' | 'female';
    disability?: string | null;
    classId: Types.ObjectId,
}

export type StudentDocument = HydratedDocument<IStudent>;

const studentSchema = new Schema<IStudent>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        birthDate: {
            type: Date,
            required: true,
            validate: {
                validator: (date: Date) => date <= new Date(),
                message: "A data de nascimento não pode ser no futuro",
            },
        },

        gender: {
            type: String,
            required: true,
            enum: ['male' , 'female'],
        },

        disability: {
            type: String,
            trim: true,
            default: null,
        },

        classId: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

studentSchema.index({ name: 1, classId: 1 }, { unique: true });

export const Student = model<IStudent>("Student", studentSchema);
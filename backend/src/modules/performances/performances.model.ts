import { Schema, Types, model} from 'mongoose';

export interface IPerformance{
    studentId: Types.ObjectId,
    classId: Types.ObjectId,
    month: number;
    year: number;
    description: string;
}

const performanceSchema = new Schema<IPerformance>(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },

        classId: {
            type: Schema.Types.ObjectId,
            ref: "Class",
            required: true,
        },

        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12
        },

        year: {
            type: Number,
            required: true,
            min: 2000,
        },

        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
        },
    },
    {
        timestamps: true,
    },
);

performanceSchema.index({ studentId: 1, month: 1, year: 1 }, { unique: true });

export const Performance = model<IPerformance>("Performance", performanceSchema);
import { Schema, Types, model} from 'mongoose';

export interface IDesempenho{
    studentId: Types.ObjectId,
    classId: Types.ObjectId,
    month: number;
    year: number;
    description: string;
}

const desempenhoSchema = new Schema<IDesempenho>(
    {
        studentId: {
            type: Schema.Types.ObjectId,
            ref: "Aluno",
            required: true,
        },

        classId: {
            type: Schema.Types.ObjectId,
            ref: "Turma",
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

desempenhoSchema.index({ studentId: 1, month: 1, year: 1 }, { unique: true });

export const Desempenho = model<IDesempenho>("Desempenho", desempenhoSchema);
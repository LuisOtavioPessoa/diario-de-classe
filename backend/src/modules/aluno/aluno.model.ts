import {Schema, Types, model} from "mongoose";

export interface IAluno{
    name: string;
    birthDate: Date;
    gender: 'male' | 'female';
    disability?: string | null;
    classId: Types.ObjectId,
}

const alunoSchema = new Schema<IAluno>(
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
            ref: "Turma",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

alunoSchema.index({ name: 1, classId: 1 }, { unique: true });

export const Aluno = model<IAluno>("Aluno", alunoSchema);
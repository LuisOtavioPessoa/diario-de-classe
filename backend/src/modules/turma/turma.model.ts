import { Schema, Types, model } from "mongoose";

export interface ITurma {
  name: string;
  year: number;
  userId: Types.ObjectId;
}

const turmaSchema = new Schema<ITurma>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
      min: 2000,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "Professor",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

turmaSchema.index({ name: 1, year: 1, userId: 1 }, { unique: true });

export const Turma = model<ITurma>("Turma", turmaSchema);
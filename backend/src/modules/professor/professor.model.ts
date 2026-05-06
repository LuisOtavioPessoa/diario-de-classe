import { Schema, model } from "mongoose";

export interface IProfessor {
  name: string;
  email: string;
  password: string;
}

const professorSchema = new Schema<IProfessor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

professorSchema.index({ email: 1 }, { unique: true });

export const Professor = model<IProfessor>("Professor", professorSchema);
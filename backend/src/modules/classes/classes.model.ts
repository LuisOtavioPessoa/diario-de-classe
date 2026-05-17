import { Schema, Types, model } from "mongoose";

export interface IClass {
  name: string;
  year: number;
  userId: Types.ObjectId;
}

const classSchema = new Schema<IClass>(
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
      ref: "Auth",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

classSchema.index({ name: 1, year: 1, userId: 1 }, { unique: true });

export const Class = model<IClass>("Class", classSchema);
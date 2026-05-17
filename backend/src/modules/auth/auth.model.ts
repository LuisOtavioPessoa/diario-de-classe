import { Schema, model } from "mongoose";

export interface IAuth {
  name: string;
  email: string;
  password: string;
}

const AuthSchema = new Schema<IAuth>(
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

AuthSchema.index({ email: 1 }, { unique: true });

export const Auth = model<IAuth>("Auth", AuthSchema);
import { Schema, model, HydratedDocument } from "mongoose";

export interface IAuth {
  name: string;
  email: string;
  password: string;
}

export type AuthDocument = HydratedDocument<IAuth>;

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
      unique: true,
      trim: true,
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

export const Auth = model<IAuth>("Auth", AuthSchema);
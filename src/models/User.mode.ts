import { Model, model, Schema } from "mongoose";

import { EGenders } from "../enums/user.enum";
import { EUserStatus } from "../enums/user-status.enum";
import { IUser } from "../types/user.type";

export interface IUserModel
  extends Model<IUser, object, IUserMethods, IUserVirtuals> {
  findByEmail(email: string): Promise<IUser>;
}

export interface IUserVirtuals {
  nameWithSurname: string;
}

interface IUserMethods {
  nameWithAge(): string;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    age: {
      type: Number,
      min: [1, "Minimum value for age is 1"],
      max: [199, "Maximum value for age is 199"],
    },
    gender: {
      type: String,
      enum: EGenders,
    },
    status: {
      type: String,
      default: EUserStatus.Inactive,
      enum: EUserStatus,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    isActivated: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.virtual("nameWithSurname").get(function () {
  return `${this.name} Zinchecnko`;
});

userSchema.methods = {
  // this = user
  nameWithAge() {
    return `${this.name} is ${this.age} years old`;
  },
};

userSchema.statics = {
  async findByEmail(email: string): Promise<IUser> {
    return this.findOne({ email });
  },
};

export const User = model<IUser, IUserModel>("user", userSchema);

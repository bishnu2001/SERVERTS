
import { Schema, model, connect } from "mongoose";
import { Users } from "../types";

const usersSchema = new Schema<Users>({
  name: {
    type: String,
    required: true 
  },
  email: {
    type: String,
    required: true, 
    unique: true 
  },
  password: {
    type: String,
    required: true 
  },
  role: {
    type: String,
    enum: ["ADMIN", "APPLICANT"],
    required: true 
  },
  avatar: String, 
  avatarPath: String,
  phoneNumber: String,
  countryCode: String,
},
{
  timestamps:true
}
);

const users = model<Users>("Users", usersSchema);

export default users;

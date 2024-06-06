import users from "../model/users.model";
import bcrypt from "bcryptjs";
import { Conflict, NotFound } from "http-errors";
import jwt from "jsonwebtoken";
import { Unauthorized } from "http-errors";
import { configs } from "../configs";
import { userforgetPassword } from "../services/email.service";
import { getAccessToken } from "../middleware/generatetoken.middleware";

type UserType = {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar: string;
  avatarPath: string;
  phoneNumber: string;
  countryCode: string;
};
type Userslogin = {
  email: string;
  password: string;
};
type Forgetpassword = {
  email: string;
};

type Resetpassword = {
  token: string;
  newPassword: string;
};
interface JwtPayload {
  id: string;
  // Add other fields if present in your JWT payload
}
type Changepassword = {
  userid: string;
  oldpassword: string;
  newpassword: string;
};
type Updateinfo = {
  userid: string;
  name: string;
  email: string;
  password:string;
  avatar:string,
  avatarPath:string,
  phoneNumber:string;
  countryCode:string;
};

export const createUsers = async ({
  name,
  email,
  password,
  role,
  avatar,
  avatarPath,
  phoneNumber,
  countryCode,
}: UserType) => {
  try {
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await users.findOne({ email });
    if (user) throw new Conflict("email already exist");
    const createduser = await users.create({
      name,
      email,
      password: hashedpassword,
      role,
      avatar,
      avatarPath,
      phoneNumber,
      countryCode,
    });
    return createduser;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async ({ email, password }: Userslogin) => {
  try {
    const user = await users.findOne({ email });
    if (!user) throw new Unauthorized("Invalid email or password");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Unauthorized("Invalid email or password");
    // const token = jwt.sign({ id: user._id }, configs.JWT_SECRET || "", {
    //   expiresIn: "1h",
    // });

    const payload: any = {
      id: user.id,
      role: user.role,
    };
    const token = getAccessToken(payload, "10d");
    const { password: pwd, ...userWithoutPassword } = user.toObject();
    return { user: userWithoutPassword, token };
  } catch (error) {
    throw error;
  }
};

export const forgetPassword = async ({ email }: Forgetpassword) => {
  try {
    const user = await users.findOne({ email });
    if (!user) throw new NotFound("email not found");
    const token = jwt.sign({ id: user.email }, configs.JWT_SECRET || "", {
      expiresIn: "1h",
    });
    const resetLink = `${configs.APP_URL}/reset-password?token=${token}`;
    const sendemail = await userforgetPassword({ email, resetLink });
    const { password: pwd, ...userWithoutPassword } = user.toObject();
    return { user: userWithoutPassword, token };
  } catch (error) {
    throw error;
  }
};
// {token,newPassword}
export const resetPassword = async ({ token, newPassword }: Resetpassword) => {
  try {
    // Verify the token
    const decoded = jwt.verify(token, configs.JWT_SECRET || "") as JwtPayload;
    if (!decoded.id) {
      throw new Error("Invalid token");
    }

    // Find the user by email
    const user = await users.findOne({ email: decoded.id });
    if (!user) {
      throw new NotFound("User not found");
    }
    const hashedpassword = await bcrypt.hash(newPassword, 10);
    // Update the user's password
    user.password = hashedpassword; // Assuming you have some logic to hash the password
    await user.save();

    // Optionally, you may want to invalidate the token here

    return { user };
  } catch (error) {
    throw error;
  }
};
export const changePassword = async ({
  userid,
  oldpassword,
  newpassword,
}: Changepassword) => {
  try {
    const user = await users.findById(userid);
    if (!user) {
      throw new Error("User not found");
    }

    // Compare old password
    const isPasswordCorrect = await bcrypt.compare(oldpassword, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Old password is incorrect");
    }
    if (newpassword.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }
    const hashedpassword = await bcrypt.hash(newpassword, 10);
    const updatedUser = await users.findByIdAndUpdate(
      userid,
      { password: hashedpassword },
      { new: true }
    );
    return { user: updatedUser };
  } catch (error) {
    throw error;
  }
};
export const updateInfo = async ({ name, email, userid,password,avatar,avatarPath,phoneNumber,countryCode }: Updateinfo) => {
  try {
    // const user = await users.findById(userid);
    // if (!user) {
    //   throw new Error("User not found");
    // }
    const hashedpassword = await bcrypt.hash(password, 10);
    const updateuser =await users.findByIdAndUpdate(userid, {
      $set: {
        name,
        email,
        password:hashedpassword,
        avatar,
        avatarPath,
        phoneNumber,
        countryCode
      },
    },{
      new:true

    });
return {user:updateuser};
  } catch (error) {
    throw error
  }
};
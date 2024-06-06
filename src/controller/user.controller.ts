import { RequestHandler } from "express";
import { NotFound, Unauthorized } from "http-errors";
import {
  createUsers,
  loginUser,
  forgetPassword,
  resetPassword,
  changePassword,
  updateInfo
} from "../business-logic/usersignup.business-logic";
// import {forgetPassword} from "../services/email.service";
import { MIDDLEWARE_REQUEST_TYPE } from "../types/global.types";
export const Userscontroller: {
  createuser: RequestHandler;
  loginUser: RequestHandler;
  forgetUser: RequestHandler;
  resetuserPassword: RequestHandler;
  changePassword: RequestHandler;
  updateInfo: RequestHandler;
} = {
  async createuser(req, res, next) {
    try {
      const {
        name,
        email,
        password,
        role,
        avatar,
        avatarPath,
        phoneNumber,
        countryCode,
      } = req?.body;
      const users = await createUsers({
        name,
        email,
        password,
        role,
        avatar,
        avatarPath,
        phoneNumber,
        countryCode,
      });
      if (!users) throw new NotFound("Something went wrong");
      res.json({
        success: true,
        message: "Signup successfull",
        date: users,
      });
      next();
    } catch (error) {
      next(error);
    }
  },
  async loginUser(req, res, next) {
    try {
      const { email, password } = req?.body;
      const user = await loginUser({ email, password });
      if (!user) throw new NotFound("Something went wrong");
      res.set("Authorization", `Bearer ${user.token}`);
      res.json({
        success: true,
        message: "Login successfull",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  async forgetUser(req, res, next) {
    try {
      const { email } = req?.body;
      // console.log(email)
      const user = await forgetPassword({ email });
      if (!user) throw new NotFound("Something went wrong");
      res.json({
        success: true,
        message: "succefully generated",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
  async resetuserPassword(req, res, next) {
    try {
      const token: string = req.query.token as string; // Explicitly specify type
      const newPassword: string = req.body.newPassword as string;
      const passwordUpdate = await resetPassword({ token, newPassword });
      res.json({
        success: true,
        message: "update successfull",
        data: passwordUpdate,
      });
    } catch (error) {
      next(error);
    }
  },
  async changePassword(req: MIDDLEWARE_REQUEST_TYPE, res, next) {
    try {
      // const userid = req.params.id;
      const current = req.user;
      const userid: string = current?.id ?? "";
      const newpassword = req.body.newpassword;
      const oldpassword = req.body.oldpassword;
      // if(userid!==current?.id) throw new Unauthorized("you can update only your password")
      const validuser = await changePassword({
        userid,
        newpassword,
        oldpassword,
      });
      res.json({
        success: true,
        message: "password change successfull",
        data: validuser,
      });
    } catch (error) {
      next(error);
    }
  },
  async updateInfo(req: MIDDLEWARE_REQUEST_TYPE, res, next) {
    try {
      const userid = req.params.id;
      const currentid = req.user;
      const {name,email,password,avatar,avatarPath,phoneNumber,countryCode}=req?.body;
      if(currentid?.role!=='ADMIN') throw Unauthorized("only admin can update")
      const updatedinfo=await updateInfo({userid,name,email,password,avatar,avatarPath,phoneNumber,countryCode})
    res.json({
      success:true,
      message:"update succefull",
      data:updatedinfo
    })
    } catch (error) {
      next(error)
    }
  },
};
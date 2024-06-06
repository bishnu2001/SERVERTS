
import { body } from "express-validator";

export const Users = {
  create: [
    body("name")
      .not()
      .isEmpty()
      .withMessage("name is required")
      .isString()
      .withMessage("name must be a string")
      .isLength({ min: 2, max: 20 })
      .withMessage("name size must be between 2 and 30 characters")
      .trim(),

    body("email")
      .not()
      .isEmpty()
      .withMessage("email is required")
      .isString()
      .withMessage("email mus be a string")
      .isEmail()
      .withMessage("please enter a valid email")
      .trim(),

    body("password")
      .not()
      .isEmpty()
      .withMessage("password is required")
      .isString()
      .withMessage("password mus be a string")
      .isLength({ min: 8 })
      .withMessage("password must be at least 8 characters ")
      .trim(),

    body("countryCode")
      .not()
      .isEmpty()
      .withMessage("countryCode is required")
      .isString()
      .withMessage("countryCode must be a string")
      .trim(),

    body("phoneNumber")
      .not()
      .isEmpty()
      .withMessage("phoneNumber is required")
      .isString()
      .withMessage("phoneNumber must be a string")
      .trim(),

    body("role")
      .not()
      .isEmpty()
      .withMessage("role is required")
      .isString()
      .withMessage("role must be a string")
      .trim(),

    body("avatar")
      .not()
      .isEmpty()
      .withMessage("avatar is required")
      .isString()
      .withMessage("avatar must be a string")
      .trim(),

    body("avatarPath")
      .not()
      .isEmpty()
      .withMessage("avatarPath is required")
      .isString()
      .withMessage("avatarPath must be a string")
      .trim(),
  ],
  login: [
    body("email")
      .not()
      .isEmpty()
      .withMessage("email is required")
      .isString()
      .withMessage("email mus be a string")
      .isEmail()
      .withMessage("please enter a valid email")
      .trim(),

    body("password")
      .not()
      .isEmpty()
      .withMessage("password is required")
      .isString()
      .withMessage("password mus be a string")
      .isLength({ min: 8 })
      .withMessage("password must be at least 8 characters ")
      .trim(),
  ],
  forget: [
    body("email")
      .not()
      .isEmpty()
      .withMessage("email is required")
      .isString()
      .withMessage("email mus be a string")
      .isEmail()
      .withMessage("please enter a valid email")
      .trim(),
  ],
  reset: [
    body("newPassword")
      .not()
      .isEmpty()
      .withMessage("password is required")
      .isString()
      .withMessage("password mus be a string")
      .isLength({ min: 8 })
      .withMessage("password must be at least 8 characters ")
      .trim(),
  ],
  changepassword: [
    body("oldpassword")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("password mus be a string")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters ")
    .trim(),
    body("newpassword")
      .not()
      .isEmpty()
      .withMessage("password is required")
      .isString()
      .withMessage("password mus be a string")
      .isLength({ min: 8 })
      .withMessage("password must be at least 8 characters ")
      .trim(),
  ],
};

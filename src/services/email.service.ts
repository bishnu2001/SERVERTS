
const nodemailer = require("nodemailer");
const template = require("../template");
import { text } from "express";
import { configs } from "../configs";
export async function welcomeEmail({
  emails,
  name,
}: {
  emails: string;
  name: string;
}) {
  try {
    const emailCredentials = {
      from: "<support@.com>",
      to: emails,
      subject: "Conformation Email",
      html: template.confirmationMail({ name }),
    };

    const transport = nodemailer.createTransport({
      host: configs.EMAIL_HOST,
      port: 587,
      auth: {
        user: configs.EMAIL_USER,
        pass: configs.EMAIL_PASS,
      },
    });

    const info = await transport.sendMail(emailCredentials);
    return info;
  } catch (error) {
    throw error;
  }
}
export async function adminMail({
  emails,
  name,
  phoneNumber,
  countryCode,
  message,
}: {
  emails: string;
  name: string;
  phoneNumber: string;
  countryCode: string;
  message: string;
}) {
  try {
    const emailCredentials = {
      from: "<support@.com>",
      to: "hello@eztech.it",
      subject: "Querry request",
      html: template.adminTemplate({
        emails,
        name,
        phoneNumber,
        countryCode,
        message,
      }),
    };

    const transport = nodemailer.createTransport({
      host: configs.EMAIL_HOST,
      port: 587,
      auth: {
        user: configs.EMAIL_USER,
        pass: configs.EMAIL_PASS,
      },
    });

    const info = await transport.sendMail(emailCredentials);
    return info;
  } catch (error) {
    throw error;
  }
}

export async function userforgetPassword({
  email,
  resetLink,
}: {
  email: string;
  resetLink: string;
}) {
  try {
    const emailCredentials = {
      from: "<support@.com>",
      to: email,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process: \n\n 
            Click <a href="${resetLink}">here</a> to reset your password.
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      // http://${req.headers.host}/reset/${token}
    };
    const transport = nodemailer.createTransport({
      host: configs.EMAIL_HOST,
      port: 587,
      auth: {
        user: configs.EMAIL_USER,
        pass: configs.EMAIL_PASS,
      },
    });

    const info = await transport.sendMail(emailCredentials);
    return info;
  } catch (error) {}
}

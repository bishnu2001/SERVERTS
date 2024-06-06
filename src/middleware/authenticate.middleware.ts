
import jwt, { JwtPayload } from "jsonwebtoken";
import { configs } from "../configs";
import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../middleware/generatetoken.middleware";
import { MIDDLEWARE_REQUEST_TYPE } from "../types/global.types";
// Middleware to authenticate incoming requests

interface CustomRequest extends Request {
  user?: string | JwtPayload;
}
export const authenticateToken = (
  req: MIDDLEWARE_REQUEST_TYPE,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Assuming the token is provided in the Authorization header as "Bearer token"

  if (!token) {
    return res.sendStatus(401); // No token provided
  }

  jwt.verify(token, configs.JWT_SECRET || " ", (err, user: any) => {
    if (err) {
      return res.sendStatus(403); // Token verification failed
    }
    req.user = user;
    // console.log(req.user)
    next();
  });
};

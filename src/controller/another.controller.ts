import { RequestHandler } from "express";
import { NotFound, Unauthorized } from "http-errors";
import { MIDDLEWARE_REQUEST_TYPE } from "../types/global.types";
import {
  create,
  get,
} from "../business-logic/jobpost.business-logic";

export const yourcontroller: {
  creta: RequestHandler;
  get: RequestHandler;
} = {
  async creta(req: MIDDLEWARE_REQUEST_TYPE, res, next) {
    try {
      const {
      your names
      } = req?.body;
      const current = req.user;
      const postedBy = current?.id;
      if (current?.role !== "ADMIN")
        throw new Unauthorized("only admin can add");
      const createjobpost = await create({
      
      });
      res.json({
        success: true,
        message: "create jobpost successfull",
        data: createjobpost,
      });
    } catch (error) {
      next(error);
    }
  },
  async get(req: MIDDLEWARE_REQUEST_TYPE, res, next) {
    try {
      const { search, perPage, pageNo, location, minExpr, maxExpr } =
        req?.query;
      const current = req.user;
      // if (current?.role !== "ADMIN");
      //throw new Unauthorized("only admin can add");
      const job = await get({
        search: typeof search == "string" ? search : undefined,
        perPage: typeof perPage == "string" ? Number(perPage) : undefined,
        pageNo: typeof pageNo == "string" ? Number(pageNo) : undefined,
        location: typeof location == "string" ? location : undefined,
        minExpr: typeof minExpr == "string" ? Number(minExpr) : undefined,
        maxExpr: typeof maxExpr == "string" ? Number(maxExpr) : undefined,
      });
      res.json({
        success: true,
        message: "search results",
        data: your,
      });
    } catch (error) {
      next(error);
    }
  },
};

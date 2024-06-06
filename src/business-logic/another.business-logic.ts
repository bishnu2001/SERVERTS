import model from "../model/j.model";
import model2 from "../model/j.model";
import { Conflict, NotFound } from "http-errors";
import { Types } from "mongoose";
import { aggregationData } from "../helper/pagination.helper";
import { controller } from "../controllers/post.controller";

type type = {
};

export const create = async ({

}: type) => {
  try {
    const findcompany = await model2.findOne({ name });
    let companyname;
    if (!findcompany) {
      const createcompany = await model2.create({ name });
      companyname = createcompany.companyName;
    } else {
      companyname = findcompany.companyName;
    }

    const create = await model.create({
    });
    return create;
  } catch (error) {
    throw error;
  }
};

export const get = async ({
  search,
  perPage,
  pageNo,
  location,
  minExpr,
  maxExpr,
  isTotalData,
  userId,
}: any) => {
  try {
    let args: any = [];
    args.push(
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_id",
        },
      },
      {
        $unwind: {
          path: "$category_id",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategory_id",
          foreignField: "_id",
          as: "subcategory_id",
        },
      },
      {
        $unwind: {
          path: "$category_id",
          preserveNullAndEmptyArrays: true,
        },
      }
    );
    if (search) {
      args.push(
        {
          ["$addFields"]: {
            ["searchTitleMatch"]: {
              ["$regexMatch"]: {
                ["input"]: "$title",
                ["regex"]: search,
                ["options"]: "i",
              },
            },
            ["searchDescriptionMatch"]: {
              ["$regexMatch"]: {
                ["input"]: "$description",
                ["regex"]: search,
                ["options"]: "i",
              },
            },
            ["searchmodeOfWorkMatch"]: {
              ["$regexMatch"]: {
                ["input"]: "$modeOfWork",
                ["regex"]: search,
                ["options"]: "i",
              },
            },
          },
        },
        { ["$unwind"]: "$title"},
        { ["$unwind"]: "$skills" },
        {
          ["$addFields"]: {
            ["searchSkillsMatch"]: {
              ["$regexMatch"]: {
                ["input"]: "$skills",
                ["regex"]: search,
                ["options"]: "i",
              },
            },
          },
        },

        {
          ["$match"]: {
            ["$expr"]: {
              ["$or"]: [
                {
                  $eq: ["$searchTitleMatch", true],
                },
                {
                  $eq: ["$searchSkillsMatch", true],
                },
                {
                  $eq: ["$searchDescriptionMatch", true],
                },
                {
                  $eq: ["searchmodeOfWorkMatch", true],
                },
              ],
            },
          },
        }
      );
    }
    //filter
    if (location) {
      args.push({
        $match: {
          $expr: {
            $eq: ["$location.city", location],
          },
        },
      });
    }
    if (minExpr && maxExpr) {
      args.push({
        $match: {
          $expr: {
            $and: [
              {
                $gte: ["$experience.min", minExpr],
              },
              {
                $lte: ["$experience.max", maxExpr],
              },
            ],
          },
        },
      });
    }

    //filter
    // if (status) {
    //   args.push({ $match: { status: status } });
    // }
    // if (userId) {
    //   args.push({
    //     $match: {
    //       $expr: {
    //         $eq: ["$_id", new ObjectId(userId)],
    //       },
    //     },
    //   });
    // }
    const name = await aggregationData({
      model: model,
      per_page: Number(perPage),
      pageNo: Number(pageNo),
      args: args,
      isTotalData: true,
    });
    return name;
  } catch (error) {
    throw error;
  }
};

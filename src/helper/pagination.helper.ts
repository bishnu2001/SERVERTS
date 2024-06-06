const { Model } = require("mongoose");

export const aggregationData = async ({
  model,
  args,
  position = args?.length,
  sort,
  per_page,
  pageNo,
  isTotalData,
}: any) => {
  try {
    sort &&
      args.splice(position, 0, {
        $sort: sort,
      });

    if (
      typeof per_page === "number" &&
      typeof pageNo === "number" &&
      per_page > -1 &&
      pageNo > -1
    ) {
      const perPage = per_page;
      const skip = +perPage * pageNo;
      const totalCount = isTotalData
        ? await model.aggregate([
            ...args,
            {
              $count: "totalCount",
            },
          ])
        : undefined;
      args.splice(position + 1, 0, {
        $skip: skip, //wrong
      });
      args.splice(position + 2, 0, {
        $limit: per_page + 1, //wrong
      });
      const dataGet = await model.aggregate(args);
      const haveNextPage = Boolean(dataGet.length === Number(perPage) + 1);
      if (haveNextPage) {
        dataGet.pop();
      }

      return {
        data: dataGet,
        haveNextPage,
        pageNo: isTotalData ? pageNo : undefined,
        perPage: isTotalData ? per_page : undefined,
        totalCount: totalCount?.[0]?.totalCount,
      };
    } else {
      const dataGet = await model.aggregate(args);
      return {
        data: dataGet,
        haveNextPage: false,
      };
    }
  } catch (error) {
    throw error;
  }
};

//uses example

// let args:any = [];

// args.push({
//   $sort: {
//     created_at: -1,
//   },
// });
// if (search) {
//   args.push(
//     {
//       ["$addFields"]: {
//         ["searchNameMatch"]: {
//           ["$regexMatch"]: {
//             ["input"]: "$customer_name",
//             ["regex"]: search,
//             ["options"]: "i",
//           },
//         },
//         ["searchEmailMatch"]: {
//           ["$regexMatch"]: {
//             ["input"]: "$email",
//             ["regex"]: search,
//             ["options"]: "i",
//           },
//         },
//       },
//     },
//     {
//       ["$match"]: {
//         ["$expr"]: {
//           ["$or"]: [
//             {
//               $eq: ["$searchNameMatch", true],
//             },
//             {
//               $eq: ["$searchEmailMatch", true],
//             },
//           ],
//         },
//       },
//     }
//   );
// }
// //filter
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
// const users = await aggregationData({
//   model: User,
//   per_page: Number(perPage),
//   pageNo: Number(pageNo),
//   args: args,
//   isTotalData: isTotalData === true,
// });
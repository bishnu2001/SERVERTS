
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { ListenerPlugin, RouterPlugin } from "./plugins";
import mongoose from "mongoose";
import { configs } from "./configs";
import fileUpload  from "express-fileupload";
const app = express();

app
  .use(cors())
  .use(express.json({ limit: "500mb" }))
  .use(express.urlencoded({ extended: true }))
  .use(fileUpload())
  .use(helmet());

async function main() {
  await mongoose.connect(configs.DB || "");
  console.log("DB connection successfull");
}
main();

RouterPlugin.setup(app);
ListenerPlugin.listen(app);

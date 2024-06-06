import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront";
import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";
import fs from "fs";
import { configs} from "../configs";

// import { ImageType } from "../type/global";
import { v4 as uuidv4 } from "uuid";

interface ImageType {
  url: string;
  path: string;
}
export default class MediaStoreService {
  private s3;
  private cloudFont;

  constructor() {
    this.s3 = new S3Client({
      region: configs.REGION ,
      credentials: {
        accessKeyId: configs.ACCESSKEY,
        secretAccessKey: configs.SECRET_KEY,
      },
    });
    this.cloudFont = new CloudFrontClient({
      region: configs.REGION,
      credentials: {
        accessKeyId: configs.ACCESSKEY,
        secretAccessKey: configs.SECRET_KEY,
      },
    });
  }
  private async invalidateFileCache(filename: string) {
    try {
      const path = [`/${filename}`];
      const cmd = new CreateInvalidationCommand({
        DistributionId: configs.CLOUD_FONT_DISTRIBUTION,
        InvalidationBatch: {
          CallerReference: new Date().getTime().toString(),
          Paths: { Quantity: path.length, Items: path },
        },
      });
      await this.cloudFont.send(cmd);
    } catch (error) {
      return false;
    }
  }

  async deleteMedia(key: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const params = {
          Bucket: `${configs.BUCKET_NAME}`,
          Key: key,
        };

        const deleteData = new DeleteObjectCommand({
          ...params,
        });
        // DELETE FROM S3 BUCKET
        await new S3Client({
          region: configs.REGION,
          credentials: {
            accessKeyId: configs.ACCESSKEY as string,
            secretAccessKey: configs.SECRET_KEY as string,
          },
        }).send(deleteData);
        // INVALIDATE THE CLOUD FRONT CACHE
        await this.invalidateFileCache(key);
        return resolve(true);
      } catch (error) {
        new Error();
        return resolve(false);
      }
    });
  }

  //delete multiple media
  public deleteMultipleMedia(paths: string[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        for (const path of paths) {
          const params = {
            Bucket: `${configs.BUCKET_NAME}`,
            Key: path,
          };

          const deleteData = new DeleteObjectCommand({
            ...params,
          });
          // DELETE FROM S3 BUCKET
          await new S3Client({
            region: configs.REGION,
            credentials: {
              accessKeyId: configs.ACCESSKEY as string,
              secretAccessKey: configs.SECRET_KEY as string,
            },
          }).send(deleteData);
          // INVALIDATE THE CLOUD FRONT CACHE
          await this.invalidateFileCache(path);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  public async uploadMedia({
    file,
    dir,
  }: {
    file: UploadedFile;
    dir?: string;
  }): Promise<{ url: string; path: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const fileSplit = file.name.split(".");
        const fileType = fileSplit[fileSplit.length - 1];
        const fileName = `${new Date().getTime()}.${fileType}`;
        const params = {
          Bucket: `${configs.BUCKET_NAME}`,
          Key: `${dir}/${fileName}`,
          Body: file?.data,
          ContentType: file.mimetype,
        };

        const objectSetUp = new PutObjectCommand({
          ...params,
        });
        const data = await new S3Client({
          region: configs.REGION,
          credentials: {
            accessKeyId: configs.ACCESSKEY as string,
            secretAccessKey: configs.SECRET_KEY as string,
          },
        }).send(objectSetUp);
        await this.invalidateFileCache(`${params?.Key}`);

        return resolve({
          path: `${params?.Key}`,
          url: `${configs.CLOUD_FONT}/${params?.Key}`,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  public async uploadPdf({
    file,
    dir,
  }: {
    file: Buffer;
    dir?: string;
  }): Promise<{ url: string; path: string }> {
    return new Promise(async (resolve, reject) => {
      try {
        const fileName = `${new Date().getTime()}.pdf`;
        const params = {
          Bucket: `${configs.BUCKET_NAME}`,
          Key: `${dir}/${fileName}`,
          Body: file,
          ContentType: "application/pdf",
        };

        const objectSetUp = new PutObjectCommand({
          ...params,
        });
        const data = await this.s3.send(objectSetUp);
        await this.invalidateFileCache(`${params?.Key}`);
        return resolve({
          path: `${params?.Key}`,
          url: `${configs.CLOUD_FONT}/${params?.Key}`,
        });
      } catch (error) {
        return reject(error);
      }
    });
  }

  /** upload multiple media */
  public uploadMultipleMedia({
    files,
    folder,
  }: {
    files: UploadedFile[];
    folder?: string;
  }): Promise<ImageType[]> {
    return new Promise(async (resolve, reject) => {
      try {
        let resultArray: ImageType[] = [];
        for (const file of files) {
          // upload media
          const fileSplit = file.name.split(".");
          const fileType = fileSplit[fileSplit.length - 1];
          const fileName = `${new Date().getTime()}.${fileType}`;
          const params = {
            Bucket: `${configs.BUCKET_NAME}`,
            Key: `${uuidv4()}/${fileName}`,
            Body: file?.data,
            ContentType: file.mimetype,
          };

          const objectSetUp = new PutObjectCommand({
            ...params,
          });
          const data = await new S3Client({
            region: configs.REGION,
            credentials: {
              accessKeyId: configs.ACCESSKEY as string,
              secretAccessKey: configs.SECRET_KEY as string,
            },
          }).send(objectSetUp);
          await this.invalidateFileCache(`${params?.Key}`);

          // push result to result array
          resultArray.push({
            path: `${params?.Key}`,
            url: `${configs.CLOUD_FONT}/${params?.Key}`,
          });
        }
        // send response to client
        resolve(resultArray);
      } catch (error) {
        reject(error);
      }
    });
  }
}



//const photo =await new MediaStoreService().uploadMedia({ file:file , dir: "test" });
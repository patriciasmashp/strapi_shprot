import {
  S3Client,
  PutObjectCommand,
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteBucketCommand,
  paginateListObjectsV2,
  GetObjectCommand,
  ListObjectsV2Command,

} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { readFileSync } from "node:fs"



const controller = ({ strapi }) => ({
  fileUploadStatus: {},
  async getFileStatus(ctx) {
    const key = ctx.request.ip
    if (!key) {
      return ctx.badRequest("No key provided");
    }
    const status = strapi.controller('plugin::telegram.controller').fileUploadStatus[key]
    if (status === undefined) {
      return ctx.notFound("No status found");
    }
    console.log(status);

    if (status.progress.loaded != status.progress.loaded.total) {
      ctx.response.status = 202
      ctx.body = status
    }
    else {
      ctx.response.status = 200
      ctx.body = status
    }
    // if(strapi.controller('plugin::telegram.controller').fileUploadStatus)
    console.log(status);
    console.log(ctx.response.status);

    ctx.body = status
  },
  index(ctx) {
    // ctx.body = strapi
    //   .plugin('telegram')
    //   // the name of the service file & the method.
    //   .service('telegramApiService')
    //   .sendMessage();
  },
  async handleFile(ctx) {
    const s3 = new S3Client();
    const bucketName = `35761e62-846cee9c-4299-4891-8e39-fc2d6f5b2938`;
    const file = ctx.request.files.file;
    const keyName = file.newFilename + "." + file.originalFilename.split(".")[1];

    const fileStream = new Upload({
      client: s3,

      queueSize: 4, // optional concurrency configuration
      // partSize: "3", // optional size of each part
      leavePartsOnError: false, // optional manually handle dropped parts
      params: {
        Bucket: bucketName,
        Key: keyName,
        Body: readFileSync(ctx.request.files.file.filepath),
      },
    });
    strapi.controller('plugin::telegram.controller').fileUploadStatus[ctx.request.ip] = {

      progress: {
        loaded: 0,
      }
    }
    fileStream.on('httpUploadProgress', (progress) => {

      strapi.controller('plugin::telegram.controller').fileUploadStatus[ctx.request.ip] = {
        key: keyName,
        progress: { loaded: progress.loaded, total: progress.total },
      }


    });
    ctx.body = { success: true, key: keyName }

    await fileStream.done();
    return "wait"
  },
});

export default controller;

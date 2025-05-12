import { randomUUID } from "node:crypto";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "express-fileupload";
import path from "path";
import sharp from "sharp";

import { configs } from "../config/configs";
import { FileItemTypeEnum } from "../enums/file-item-type.enum";

class S3Service {
  constructor(
    private readonly client = new S3Client({
      region: configs.AWS_S3_REGION,
      credentials: {
        accessKeyId: configs.AWS_ACCESS_KEY,
        secretAccessKey: configs.AWS_SECRET_KEY,
      },
    }),
  ) {}

  public async uploadFiles(
    file: UploadedFile | UploadedFile[],
    itemType: FileItemTypeEnum,
    itemId: string,
  ): Promise<string | string[]> {
    try {
      if (Array.isArray(file)) {
        const filePaths = await Promise.all(
          file.map(async (singleFile) => {
            return await this.uploadSingleFile(singleFile, itemType, itemId);
          }),
        );
        return filePaths;
      }

      return await this.uploadSingleFile(file, itemType, itemId);
    } catch (error) {
      console.error("Error uploading file(s):", error);
      throw error;
    }
  }

  public async uploadSingleFile(
    file: UploadedFile,
    itemType: FileItemTypeEnum,
    itemId: string,
  ): Promise<string> {
    const filePath = this.buildPath(
      itemType,
      itemId,
      file.name.replace(/\.\w+$/, ".webp"),
    );
    const webpBuffer = await sharp(file.data)
      .resize({ width: 800 })
      .webp({ quality: 70 })
      .toBuffer();

    await this.client.send(
      new PutObjectCommand({
        Bucket: configs.AWS_S3_BUCKET_NAME,
        Key: filePath,
        Body: webpBuffer,
        ContentType: "image/webp",
        ACL: configs.AWS_S3_ACL,
      }),
    );

    return filePath;
  }

  public async deleteFile(filePath: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: configs.AWS_S3_BUCKET_NAME,
          Key: filePath,
        }),
      );
    } catch (error) {
      console.error("Error delete: ", error.message);
    }
  }

  private buildPath(
    itemType: FileItemTypeEnum,
    itemId: string,
    fileName: string,
  ): string {
    return `${itemType}/${itemId}/${randomUUID()}${path.extname(fileName)}`;
  }
}

export const s3Service = new S3Service();

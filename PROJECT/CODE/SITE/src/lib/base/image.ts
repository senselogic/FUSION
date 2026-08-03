// -- IMPORTS

import fs from "fs/promises";
import sharp from "sharp";

// -- FUNCTIONS

export async function readImage(imageFilePath: string): Promise<Buffer> {
  return await fs.readFile(imageFilePath);
}

export async function writeImage(imageBuffer: Uint8Array, imageFilePath: string): Promise<void> {
  await fs.writeFile(imageFilePath, imageBuffer);
}

export async function createResizedImage(
  imageBuffer: Uint8Array,
  newWidth: number,
  newHeight: number,
  quality = 80,
  fit: keyof sharp.FitEnum = "cover",
  fileFormat: keyof sharp.FormatEnum = "avif",
): Promise<Buffer> {
  return await sharp(imageBuffer).resize(newWidth, newHeight, { fit }).toFormat(fileFormat, { quality }).toBuffer();
}

export async function createConstrainedImage(
  imageBuffer: Uint8Array,
  minimumWidth = 0,
  maximumWidth = 32768,
  minimumHeight = 0,
  maximumHeight = 32768,
  quality = 80,
  fileFormat: keyof sharp.FormatEnum = "avif",
): Promise<Buffer> {
  const metadata = await sharp(imageBuffer).metadata();
  let newWidth = metadata.width ?? 0;
  let newHeight = metadata.height ?? 0;

  if (newWidth < minimumWidth && newWidth > 0) {
    newHeight = Math.round((newHeight * minimumWidth) / newWidth);
    newWidth = minimumWidth;
  } else if (newWidth > maximumWidth && newWidth > 0) {
    newHeight = Math.round((newHeight * maximumWidth) / newWidth);
    newWidth = maximumWidth;
  }

  if (newHeight < minimumHeight && newHeight > 0) {
    newWidth = Math.round((newWidth * minimumHeight) / newHeight);
    newHeight = minimumHeight;
  } else if (newHeight > maximumHeight && newHeight > 0) {
    newWidth = Math.round((newWidth * maximumHeight) / newHeight);
    newHeight = maximumHeight;
  }

  return await sharp(imageBuffer).resize(newWidth, newHeight).toFormat(fileFormat).toBuffer();
}

export async function createLimitedImage(
  imageBuffer: Uint8Array,
  maximumPixelCount: number,
  quality = 80,
  fileFormat: keyof sharp.FormatEnum = "avif",
): Promise<Buffer> {
  const metadata = await sharp(imageBuffer).metadata();
  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  const oldPixelCount = width * height;

  if (oldPixelCount > maximumPixelCount && oldPixelCount > 0) {
    const scaleRatio = Math.sqrt(maximumPixelCount / oldPixelCount);
    const newWidth = Math.max(Math.round(width * scaleRatio), 1);
    const newHeight = Math.max(Math.round(height * scaleRatio), 1);

    return await sharp(imageBuffer).resize(newWidth, newHeight).toFormat(fileFormat, { quality }).toBuffer();
  }

  return Buffer.from(imageBuffer);
}


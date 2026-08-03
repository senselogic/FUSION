// -- IMPORTS

import { exec } from "child_process";
import fs from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { createCappedImage, createCoveredImage } from "senselogic-pika";
import { promisify } from "util";
import { bunnyService } from "./bunny_service";
import { supabaseService } from "./supabase_service";

const execAsync = promisify(exec);

// -- TYPES

export class FileService {
  // -- INQUIRIES

  getFileUrl(filePath: string): string {
    if (filePath.startsWith("/bunny/")) {
      return bunnyService.getFileUrl(filePath.substring(7));
    } else if (filePath.startsWith("/supabase/")) {
      return supabaseService.getFileUrl(filePath.substring(9));
    } else {
      return filePath;
    }
  }

  // -- OPERATIONS

  async copyFile(sourceFile: string | Uint8Array, targetFilePath: string, targetFileIsOverwritten = false) {
    if (targetFilePath.startsWith("/bunny/")) {
      return await bunnyService.copyFile(sourceFile, targetFilePath.substring(7), targetFileIsOverwritten);
    } else if (targetFilePath.startsWith("/supabase/")) {
      return await supabaseService.copyFile(sourceFile, targetFilePath.substring(9), targetFileIsOverwritten);
    } else {
      if (typeof sourceFile === "string") {
        return await fs.copyFile(sourceFile, targetFilePath);
      } else {
        return await fs.writeFile(targetFilePath, sourceFile);
      }
    }
  }

  // ~~

  async removeFile(targetFilePath: string) {
    if (targetFilePath.startsWith("/bunny/")) {
      return await bunnyService.removeFile(targetFilePath.substring(7));
    } else if (targetFilePath.startsWith("/supabase/")) {
      return await supabaseService.removeFile(targetFilePath.substring(9));
    } else {
      return await fs.unlink(targetFilePath);
    }
  }

  // ~~

  async copyImageFile(sourceImageFile: string, targetFilePath: string, targetFileIsOverwritten = false): Promise<void> {
    const preloadImage = createCappedImage(sourceImageFile, 360, 720, "avif", 30);
    const preloadImageFilePath = targetFilePath + ".preload.avif";
    await this.copyFile(preloadImage as unknown as Uint8Array, preloadImageFilePath, targetFileIsOverwritten);

    const tinyImage = createCappedImage(sourceImageFile, 480, 960, "avif", 60);
    const tinyImageFilePath = targetFilePath + ".tiny.avif";
    await this.copyFile(tinyImage as unknown as Uint8Array, tinyImageFilePath, targetFileIsOverwritten);

    const smallImage = createCappedImage(sourceImageFile, 640, 1280, "avif", 60);
    const smallImageFilePath = targetFilePath + ".small.avif";
    await this.copyFile(smallImage as unknown as Uint8Array, smallImageFilePath, targetFileIsOverwritten);

    const mediumImage = createCappedImage(sourceImageFile, 960, 1920, "avif", 60);
    const mediumImageFilePath = targetFilePath + ".medium.avif";
    await this.copyFile(mediumImage as unknown as Uint8Array, mediumImageFilePath, targetFileIsOverwritten);

    const wideImage = createCappedImage(sourceImageFile, 1280, 2560, "avif", 60);
    const wideImageFilePath = targetFilePath + ".wide.avif";
    await this.copyFile(wideImage as unknown as Uint8Array, wideImageFilePath, targetFileIsOverwritten);

    const largeImage = createCappedImage(sourceImageFile, 1920, 1920, "avif", 60);
    const largeImageFilePath = targetFilePath;
    await this.copyFile(largeImage as unknown as Uint8Array, largeImageFilePath, targetFileIsOverwritten);

    const bigImage = createCappedImage(sourceImageFile, 2560, 2560, "avif", 60);
    const bigImageFilePath = targetFilePath + ".big.avif";
    await this.copyFile(bigImage as unknown as Uint8Array, bigImageFilePath, targetFileIsOverwritten);

    const hugeImage = createCappedImage(sourceImageFile, 3840, 3840, "avif", 60);
    const hugeImageFilePath = targetFilePath + ".huge.avif";
    await this.copyFile(hugeImage as unknown as Uint8Array, hugeImageFilePath, targetFileIsOverwritten);

    const metaImage = createCoveredImage(sourceImageFile, 1200, 630, "jpeg", 85);
    const metaImageFilePath = targetFilePath + ".meta.jpg";
    await this.copyFile(metaImage as unknown as Uint8Array, metaImageFilePath, targetFileIsOverwritten);
  }

  // ~~

  async removeImageFile(targetFilePath: string): Promise<void> {
    const preloadImageFilePath = targetFilePath + ".preload.avif";
    await this.removeFile(preloadImageFilePath);

    const tinyImageFilePath = targetFilePath + ".tiny.avif";
    await this.removeFile(tinyImageFilePath);

    const smallImageFilePath = targetFilePath + ".small.avif";
    await this.removeFile(smallImageFilePath);

    const mediumImageFilePath = targetFilePath + ".medium.avif";
    await this.removeFile(mediumImageFilePath);

    const wideImageFilePath = targetFilePath + ".wide.avif";
    await this.removeFile(wideImageFilePath);

    const largeImageFilePath = targetFilePath;
    await this.removeFile(largeImageFilePath);

    const bigImageFilePath = targetFilePath + ".big.avif";
    await this.removeFile(bigImageFilePath);

    const hugeImageFilePath = targetFilePath + ".huge.avif";
    await this.removeFile(hugeImageFilePath);

    const metaImageFilePath = targetFilePath + ".meta.jpg";
    await this.removeFile(metaImageFilePath);
  }

  // ~~

  async convertVideoFile(
    sourceVideoFile: string,
    targetFilePath: string,
    width: number,
    targetFileIsOverwritten = false,
  ): Promise<void> {
    const temporaryDir = await fs.mkdtemp(join(tmpdir(), "video-"));
    const temporaryFilePath = join(temporaryDir, "temp.mp4");

    try {
      const command = `ffmpeg -y -i '${sourceVideoFile}' -vf 'scale=${width}:-2' -c:v libx264 -crf 30 -preset slow -c:a aac -movflags +faststart '${temporaryFilePath}'`;
      await execAsync(command);
      await this.copyFile(temporaryFilePath, targetFilePath, targetFileIsOverwritten);
    } catch (error) {
      throw new Error(`Video conversion failed: ${targetFilePath}`);
    } finally {
      try {
        await fs.unlink(temporaryFilePath);
        await fs.rm(temporaryDir, { recursive: true, force: true });
      } catch {
        // ignore cleanup failures
      }
    }
  }

  // ~~

  async copyVideoFile(sourceVideoFile: string, targetFilePath: string, targetFileIsOverwritten = false): Promise<void> {
    const smallVideoFilePath = targetFilePath + ".small.mp4";
    await this.convertVideoFile(sourceVideoFile, smallVideoFilePath, 640, targetFileIsOverwritten);

    const wideVideoFilePath = targetFilePath + ".wide.mp4";
    await this.convertVideoFile(sourceVideoFile, wideVideoFilePath, 1280, targetFileIsOverwritten);

    const largeVideoFilePath = targetFilePath;
    await this.convertVideoFile(sourceVideoFile, largeVideoFilePath, 1920, targetFileIsOverwritten);
  }

  // ~~

  async removeVideoFile(targetFilePath: string): Promise<void> {
    const smallVideoFilePath = targetFilePath + ".small.mp4";
    await this.removeFile(smallVideoFilePath);

    const wideVideoFilePath = targetFilePath + ".wide.mp4";
    await this.removeFile(wideVideoFilePath);

    const largeVideoFilePath = targetFilePath;
    await this.removeFile(largeVideoFilePath);
  }
}

// -- VARIABLES

export const fileService = new FileService();


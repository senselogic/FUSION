declare module "senselogic-opus" {
  export function logError(error: unknown): void;

  export function getMap<T extends Record<string, unknown>>(arr: T[], key: string): Record<string, T>;
  export function getMapById<T extends { id: string }>(arr: T[]): Record<string, T>;
}

declare module "senselogic-pika" {
  export function createCappedImage(
    sourceImageFile: string,
    minWidth: number,
    maxWidth: number,
    format: string,
    quality: number,
  ): Uint8Array;

  export function createCoveredImage(
    sourceImageFile: string,
    width: number,
    height: number,
    format: string,
    quality: number,
  ): Uint8Array;
}


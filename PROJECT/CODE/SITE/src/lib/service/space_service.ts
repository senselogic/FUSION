// -- IMPORTS

import { getMapById, logError } from "senselogic-opus";
import { supabaseService } from "./supabase_service";
import { spaceTypeService } from "./space_type_service";

// -- TYPES

type Space = { id: string; typeId?: string; propertyId?: string } & Record<string, unknown>;

class SpaceService {
  // -- CONSTRUCTORS

  cachedSpaceArray: Space[] | null;
  cachedSpaceArrayTimestamp: number;
  cachedSpaceByIdMap: Record<string, Space> | null;

  constructor() {
    this.cachedSpaceArray = null;
    this.cachedSpaceArrayTimestamp = 0;
    this.cachedSpaceByIdMap = null;
  }

  // -- INQUIRIES

  inflateSpaceArray(spaceArray: Space[], spaceTypeByIdMap: Record<string, Record<string, unknown>>): void {
    for (const space of spaceArray) {
      if (space.typeId) {
        (space as Record<string, unknown>).type = spaceTypeByIdMap[space.typeId];
      }
    }
  }

  // ~~

  async getSpaceArray(): Promise<Space[] | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("SPACE").select();

    if (error !== null) {
      logError(error);
    }

    return data as unknown as Space[] | null;
  }

  // ~~

  async getSpaceById(spaceId: string): Promise<Space | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("SPACE").select().eq("id", spaceId);

    if (error !== null) {
      logError(error);
    }

    const arr = data as unknown as Space[] | null;
    return arr !== null ? (arr[0] ?? null) : null;
  }

  // ~~

  async getSpaceArrayByPropertyId(propertyId: string, isInflated = false): Promise<Space[] | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("SPACE").select().eq("propertyId", propertyId);

    if (error !== null) {
      logError(error);
    }

    const arr = data as unknown as Space[] | null;

    if (arr !== null && isInflated) {
      this.inflateSpaceArray(arr, await spaceTypeService.getCachedSpaceTypeByIdMap());
    }

    return arr;
  }

  // ~~

  async getSpaceArrayByPropertyIdArray(propertyIdArray: string[]): Promise<Space[] | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("SPACE").select().in("propertyId", propertyIdArray);

    if (error !== null) {
      logError(error);
    }

    return data as unknown as Space[] | null;
  }

  // -- OPERATIONS

  clearCache(): void {
    this.cachedSpaceArray = null;
    this.cachedSpaceByIdMap = null;
  }

  // ~~

  async getCachedSpaceArray(): Promise<Space[] | null> {
    if (this.cachedSpaceArray === null || Date.now() > this.cachedSpaceArrayTimestamp + 300000) {
      this.cachedSpaceArray = await this.getSpaceArray();
      this.cachedSpaceArrayTimestamp = Date.now();
      this.cachedSpaceByIdMap = null;
    }

    return this.cachedSpaceArray;
  }

  // ~~

  async getCachedSpaceByIdMap(): Promise<Record<string, Space>> {
    if (this.cachedSpaceByIdMap === null || Date.now() > this.cachedSpaceArrayTimestamp + 300000) {
      const arr = (await this.getCachedSpaceArray()) ?? [];
      this.cachedSpaceByIdMap = getMapById(arr) as Record<string, Space>;
    }

    return this.cachedSpaceByIdMap;
  }

  // ~~

  async addSpace(space: Partial<Space>, request: unknown, reply: unknown) {
    this.clearCache();

    const { data, error } = await (supabaseService as any).getClient(request as any, reply as any).from("SPACE").insert(space);

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  // ~~

  async setSpaceById(space: Partial<Space>, spaceId: string, request: unknown, reply: unknown) {
    this.clearCache();

    const { data, error } = await (supabaseService as any)
      .getClient(request as any, reply as any)
      .from("SPACE")
      .update(space)
      .eq("id", spaceId);

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  // ~~

  async removeSpaceById(spaceId: string, request: unknown, reply: unknown) {
    this.clearCache();

    const { data, error } = await (supabaseService as any).getClient(request as any, reply as any).from("SPACE").delete().eq("id", spaceId);

    if (error !== null) {
      logError(error);
    }

    return data;
  }
}

// -- VARIABLES

export const spaceService = new SpaceService();


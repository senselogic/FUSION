// -- IMPORTS

import { getMapById, logError } from "senselogic-opus";
import { supabaseService } from "./supabase_service";

// -- TYPES

type SpaceType = { id: string } & Record<string, unknown>;

class SpaceTypeService {
  // -- CONSTRUCTORS

  cachedSpaceTypeArray: SpaceType[] | null;
  cachedSpaceTypeArrayTimestamp: number;
  cachedSpaceTypeByIdMap: Record<string, SpaceType> | null;

  constructor() {
    this.cachedSpaceTypeArray = null;
    this.cachedSpaceTypeArrayTimestamp = 0;
    this.cachedSpaceTypeByIdMap = null;
  }

  // -- INQUIRIES

  async getSpaceTypeArray(): Promise<SpaceType[] | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("SPACE_TYPE").select();

    if (error !== null) {
      logError(error);
    }

    return data as unknown as SpaceType[] | null;
  }

  // ~~

  async getSpaceTypeById(spaceTypeId: string): Promise<SpaceType | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("SPACE_TYPE").select().eq("id", spaceTypeId);

    if (error !== null) {
      logError(error);
    }

    const arr = data as unknown as SpaceType[] | null;
    return arr !== null ? (arr[0] ?? null) : null;
  }

  // -- OPERATIONS

  clearCache(): void {
    this.cachedSpaceTypeArray = null;
    this.cachedSpaceTypeByIdMap = null;
  }

  // ~~

  async getCachedSpaceTypeArray(): Promise<SpaceType[] | null> {
    if (this.cachedSpaceTypeArray === null || Date.now() > this.cachedSpaceTypeArrayTimestamp + 300000) {
      this.cachedSpaceTypeArray = await this.getSpaceTypeArray();
      this.cachedSpaceTypeArrayTimestamp = Date.now();
      this.cachedSpaceTypeByIdMap = null;
    }

    return this.cachedSpaceTypeArray;
  }

  // ~~

  async getCachedSpaceTypeByIdMap(): Promise<Record<string, SpaceType>> {
    if (this.cachedSpaceTypeByIdMap === null || Date.now() > this.cachedSpaceTypeArrayTimestamp + 300000) {
      const arr = (await this.getCachedSpaceTypeArray()) ?? [];
      this.cachedSpaceTypeByIdMap = getMapById(arr) as Record<string, SpaceType>;
    }

    return this.cachedSpaceTypeByIdMap;
  }

  // ~~

  async addSpaceType(spaceType: Partial<SpaceType>) {
    this.clearCache();

    const { data, error } = await supabaseService.getClient(null, null).from("SPACE_TYPE").insert(spaceType);

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  // ~~

  async setSpaceTypeById(spaceType: Partial<SpaceType>, spaceTypeId: string) {
    this.clearCache();

    const { data, error } = await supabaseService
      .getClient(null, null)
      .from("SPACE_TYPE")
      .update(spaceType)
      .eq("id", spaceTypeId);

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  // ~~

  async removeSpaceTypeById(spaceTypeId: string) {
    this.clearCache();

    const { data, error } = await supabaseService.getClient(null, null).from("SPACE_TYPE").delete().eq("id", spaceTypeId);

    if (error !== null) {
      logError(error);
    }

    return data;
  }
}

// -- VARIABLES

export const spaceTypeService = new SpaceTypeService();


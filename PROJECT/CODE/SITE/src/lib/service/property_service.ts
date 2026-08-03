// -- IMPORTS

import { getMapById, logError } from "senselogic-opus";
import { spaceService } from "./space_service";
import { supabaseService } from "./supabase_service";

// -- TYPES

type Space = { id: string; propertyId?: string } & Record<string, unknown>;
type Property = { id: string; spaceArray?: Space[]; spaceByIdMap?: Record<string, Space> } & Record<string, unknown>;

class PropertyService {
  // -- CONSTRUCTORS

  cachedPropertyArray: Property[] | null;
  cachedPropertyArrayTimestamp: number;
  cachedPropertyByIdMap: Record<string, Property> | null;

  constructor() {
    this.cachedPropertyArray = null;
    this.cachedPropertyArrayTimestamp = 0;
    this.cachedPropertyByIdMap = null;
  }

  // -- INQUIRIES

  inflateProperty(property: Property, propertySpaceArray: Space[]): void {
    property.spaceArray = propertySpaceArray;
    property.spaceByIdMap = getMapById(propertySpaceArray) as Record<string, Space>;
  }

  // ~~

  inflatePropertyArray(propertyArray: Property[], spaceArray: Space[]): void {
    const propertyByIdMap: Record<string, Property> = {};

    for (const property of propertyArray) {
      property.spaceArray = [];
      property.spaceByIdMap = {};
      propertyByIdMap[property.id] = property;
    }

    for (const space of spaceArray) {
      const property = propertyByIdMap[space.propertyId ?? ""];
      if (!property) continue;
      property.spaceArray?.push(space);
      if (property.spaceByIdMap) {
        property.spaceByIdMap[space.id] = space;
      }
    }
  }

  // ~~

  async getPropertyArray(isInflated = false): Promise<Property[] | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("PROPERTY").select();

    if (error !== null) {
      logError(error);
    }

    const arr = data as unknown as Property[] | null;

    if (arr !== null && isInflated) {
      this.inflatePropertyArray(arr, ((await spaceService.getSpaceArray()) ?? []) as Space[]);
    }

    return arr;
  }

  // ~~

  async getFavoritePropertyArray(isInflated = false): Promise<Property[] | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("PROPERTY").select().eq("isFavorite", true);

    if (error !== null) {
      logError(error);
    }

    const arr = data as unknown as Property[] | null;

    if (arr !== null && isInflated) {
      this.inflatePropertyArray(arr, ((await spaceService.getSpaceArray()) ?? []) as Space[]);
    }

    return arr;
  }

  // ~~

  async getPropertyById(propertyId: string, isInflated = false): Promise<Property | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("PROPERTY").select().eq("id", propertyId);

    if (error !== null) {
      logError(error);
    }

    const arr = data as unknown as Property[] | null;

    if (arr !== null) {
      const property = arr[0] ?? null;

      if (property && isInflated) {
        this.inflateProperty(
          property,
          (((await spaceService.getSpaceArrayByPropertyId(property.id, true)) ?? []) as Space[]).slice(),
        );
      }

      return property;
    }

    return null;
  }

  // -- OPERATIONS

  clearCache(): void {
    this.cachedPropertyArray = null;
    this.cachedPropertyByIdMap = null;
  }

  // ~~

  async getCachedPropertyArray(): Promise<Property[] | null> {
    if (this.cachedPropertyArray === null || Date.now() > this.cachedPropertyArrayTimestamp + 300000) {
      this.cachedPropertyArray = await this.getPropertyArray();
      this.cachedPropertyArrayTimestamp = Date.now();
      this.cachedPropertyByIdMap = null;
    }

    return this.cachedPropertyArray;
  }

  // ~~

  async getCachedPropertyByIdMap(): Promise<Record<string, Property>> {
    if (this.cachedPropertyByIdMap === null || Date.now() > this.cachedPropertyArrayTimestamp + 300000) {
      const arr = (await this.getCachedPropertyArray()) ?? [];
      this.cachedPropertyByIdMap = getMapById(arr) as Record<string, Property>;
    }

    return this.cachedPropertyByIdMap;
  }

  // ~~

  async addProperty(property: Partial<Property>, request: unknown, reply: unknown) {
    this.clearCache();

    const { data, error } = await (supabaseService as any).getClient(request as any, reply as any).from("PROPERTY").insert(property);

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  // ~~

  async setPropertyById(property: Partial<Property>, propertyId: string, request: unknown, reply: unknown) {
    this.clearCache();

    const { data, error } = await (supabaseService as any)
      .getClient(request as any, reply as any)
      .from("PROPERTY")
      .update(property)
      .eq("id", propertyId);

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  // ~~

  async removePropertyById(propertyId: string, request: unknown, reply: unknown) {
    this.clearCache();

    const { data, error } = await (supabaseService as any)
      .getClient(request as any, reply as any)
      .from("PROPERTY")
      .delete()
      .eq("id", propertyId);

    if (error !== null) {
      logError(error);
    }

    return data;
  }
}

// -- VARIABLES

export const propertyService = new PropertyService();


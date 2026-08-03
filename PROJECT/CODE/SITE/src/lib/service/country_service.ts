// -- IMPORTS

import { getMap, logError } from "senselogic-opus";
import { supabaseService } from "./supabase_service";

// -- TYPES

type Country = { code: string } & Record<string, unknown>;

class CountryService {
  cachedCountryArray: Country[] | null;
  cachedCountryArrayTimestamp: number;
  cachedCountryByCodeMap: Record<string, Country> | null;

  constructor() {
    this.cachedCountryArray = null;
    this.cachedCountryArrayTimestamp = 0;
    this.cachedCountryByCodeMap = null;
  }

  // -- INQUIRIES

  async getCountryArray(): Promise<Country[] | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("COUNTRY").select();

    if (error !== null) {
      logError(error);
    }

    return data as unknown as Country[] | null;
  }

  async getCountryByCode(countryCode: string): Promise<Country | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("COUNTRY").select().eq("code", countryCode);

    if (error !== null) {
      logError(error);
    }

    const arr = data as unknown as Country[] | null;
    return arr !== null ? (arr[0] ?? null) : null;
  }

  // -- OPERATIONS

  clearCache(): void {
    this.cachedCountryArray = null;
    this.cachedCountryByCodeMap = null;
  }

  async getCachedCountryArray(): Promise<Country[] | null> {
    if (this.cachedCountryArray === null || Date.now() > this.cachedCountryArrayTimestamp + 300000) {
      this.cachedCountryArray = await this.getCountryArray();
      this.cachedCountryArrayTimestamp = Date.now();
      this.cachedCountryByCodeMap = null;
    }

    return this.cachedCountryArray;
  }

  async getCachedCountryByCodeMap(): Promise<Record<string, Country>> {
    if (this.cachedCountryByCodeMap === null || Date.now() > this.cachedCountryArrayTimestamp + 300000) {
      const arr = (await this.getCachedCountryArray()) ?? [];
      this.cachedCountryByCodeMap = getMap(arr, "code") as Record<string, Country>;
    }

    return this.cachedCountryByCodeMap;
  }

  async addCountry(country: Partial<Country>) {
    this.clearCache();

    const { data, error } = await supabaseService.getClient(null, null).from("COUNTRY").insert(country);

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  async setCountryByCode(country: Partial<Country>, countryCode: string) {
    this.clearCache();

    const { data, error } = await supabaseService.getClient(null, null).from("COUNTRY").update(country).eq("code", countryCode);

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  async removeCountryByCode(countryCode: string) {
    this.clearCache();

    const { data, error } = await supabaseService.getClient(null, null).from("COUNTRY").delete().eq("code", countryCode);

    if (error !== null) {
      logError(error);
    }

    return data;
  }
}

// -- VARIABLES

export const countryService = new CountryService();


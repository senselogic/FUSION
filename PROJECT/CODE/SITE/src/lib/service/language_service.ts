// -- IMPORTS

import { getMap, logError } from "senselogic-opus";
import { supabaseService } from "./supabase_service";

// -- TYPES

type Language = { code: string } & Record<string, unknown>;

class LanguageService {
  cachedLanguageArray: Language[] | null;
  cachedLanguageArrayTimestamp: number;
  cachedLanguageByCodeMap: Record<string, Language> | null;

  constructor() {
    this.cachedLanguageArray = null;
    this.cachedLanguageArrayTimestamp = 0;
    this.cachedLanguageByCodeMap = null;
  }

  // -- INQUIRIES

  async getLanguageArray(): Promise<Language[] | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("LANGUAGE").select();

    if (error !== null) {
      logError(error);
    }

    return data as unknown as Language[] | null;
  }

  // ~~

  async getLanguageByCode(languageCode: string): Promise<Language | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("LANGUAGE").select().eq("code", languageCode);

    if (error !== null) {
      logError(error);
    }

    const arr = data as unknown as Language[] | null;
    return arr !== null ? (arr[0] ?? null) : null;
  }

  // -- OPERATIONS

  clearCache(): void {
    this.cachedLanguageArray = null;
    this.cachedLanguageByCodeMap = null;
  }

  async getCachedLanguageArray(): Promise<Language[] | null> {
    if (this.cachedLanguageArray === null || Date.now() > this.cachedLanguageArrayTimestamp + 300000) {
      this.cachedLanguageArray = await this.getLanguageArray();
      this.cachedLanguageArrayTimestamp = Date.now();
      this.cachedLanguageByCodeMap = null;
    }

    return this.cachedLanguageArray;
  }

  async getCachedLanguageByCodeMap(): Promise<Record<string, Language>> {
    if (this.cachedLanguageByCodeMap === null || Date.now() > this.cachedLanguageArrayTimestamp + 300000) {
      const arr = (await this.getCachedLanguageArray()) ?? [];
      this.cachedLanguageByCodeMap = getMap(arr, "code") as Record<string, Language>;
    }

    return this.cachedLanguageByCodeMap;
  }

  async addLanguage(language: Partial<Language>) {
    this.clearCache();

    const { data, error } = await supabaseService.getClient(null, null).from("LANGUAGE").insert(language);

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  async setLanguageByCode(language: Partial<Language>, languageCode: string) {
    this.clearCache();

    const { data, error } = await supabaseService.getClient(null, null).from("LANGUAGE").update(language).eq("code", languageCode);

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  async removeLanguageByCode(languageCode: string) {
    this.clearCache();

    const { data, error } = await supabaseService.getClient(null, null).from("LANGUAGE").delete().eq("code", languageCode);

    if (error !== null) {
      logError(error);
    }

    return data;
  }
}

// -- VARIABLES

export const languageService = new LanguageService();


// -- IMPORTS

import { getMapById, logError } from "senselogic-opus";
import { supabaseService } from "./supabase_service";

// -- TYPES

type Contact = { id: string; typeId?: string } & Record<string, unknown>;

class ContactService {
  cachedContactArray: Contact[] | null;
  cachedContactArrayTimestamp: number;
  cachedContactByIdMap: Record<string, Contact> | null;

  constructor() {
    this.cachedContactArray = null;
    this.cachedContactArrayTimestamp = 0;
    this.cachedContactByIdMap = null;
  }

  // -- INQUIRIES

  inflateContactArray(contactArray: Contact[], contactTypeByIdMap: Record<string, Record<string, unknown>>): void {
    for (const contact of contactArray) {
      if (contact.typeId) {
        (contact as Record<string, unknown>).type = contactTypeByIdMap[contact.typeId];
      }
    }
  }

  async getContactArray(): Promise<Contact[] | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("CONTACT").select();

    if (error !== null) {
      logError(error);
    }

    return data as unknown as Contact[] | null;
  }

  async getContactById(contactId: string): Promise<Contact | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("CONTACT").select().eq("id", contactId);

    if (error !== null) {
      logError(error);
    }

    const arr = data as unknown as Contact[] | null;
    return arr !== null ? (arr[0] ?? null) : null;
  }

  async getContactArrayByMail(mail: string): Promise<Contact[] | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("CONTACT").select().eq("mail", mail);

    if (error !== null) {
      logError(error);
    }

    return data as unknown as Contact[] | null;
  }

  async getContactArrayByMailArray(mailArray: string[]): Promise<Contact[] | null> {
    const { data, error } = await supabaseService.getClient(null, null).from("CONTACT").select().in("mail", mailArray);

    if (error !== null) {
      logError(error);
    }

    return data as unknown as Contact[] | null;
  }

  // -- OPERATIONS

  clearCache(): void {
    this.cachedContactArray = null;
    this.cachedContactByIdMap = null;
  }

  async getCachedContactArray(): Promise<Contact[] | null> {
    if (this.cachedContactArray === null || Date.now() > this.cachedContactArrayTimestamp + 300000) {
      this.cachedContactArray = await this.getContactArray();
      this.cachedContactArrayTimestamp = Date.now();
      this.cachedContactByIdMap = null;
    }

    return this.cachedContactArray;
  }

  async getCachedContactByIdMap(): Promise<Record<string, Contact>> {
    if (this.cachedContactByIdMap === null || Date.now() > this.cachedContactArrayTimestamp + 300000) {
      const arr = (await this.getCachedContactArray()) ?? [];
      this.cachedContactByIdMap = getMapById(arr) as Record<string, Contact>;
    }

    return this.cachedContactByIdMap;
  }

  async addContact(contact: Partial<Contact>) {
    this.clearCache();

    const { data, error } = await supabaseService.getClient(null, null).from("CONTACT").insert(contact);

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  async setContactById(contact: Partial<Contact>, contactId: string) {
    this.clearCache();

    const { data, error } = await supabaseService.getClient(null, null).from("CONTACT").update(contact).eq("id", contactId);

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  async removeContactById(contactId: string) {
    this.clearCache();

    const { data, error } = await supabaseService.getClient(null, null).from("CONTACT").delete().eq("id", contactId);

    if (error !== null) {
      logError(error);
    }

    return data;
  }
}

// -- VARIABLES

export const contactService = new ContactService();


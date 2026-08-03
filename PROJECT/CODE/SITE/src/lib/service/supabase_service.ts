// -- IMPORTS

import { createServerClient } from "@supabase/ssr";
import fs from "fs/promises";
import { logError } from "senselogic-opus";

type CookieLike = {
  name: string;
  value: string;
  options?: Record<string, unknown>;
};

type CookieCapableRequest = {
  cookies?: Record<string, string | undefined>;
} | null;

type CookieCapableReply = {
  setCookie: (name: string, value: string, options?: Record<string, unknown>) => void;
  clearCookie: (name: string, options?: Record<string, unknown>) => void;
} | null;

// -- STATEMENTS

class SupabaseService {
  // -- CONSTRUCTORS

  anonymousClient: ReturnType<typeof createServerClient> | null;
  databaseKey: string | undefined;
  databaseUrl: string | undefined;
  storageName: string | undefined;
  storageUrl: string | undefined;

  constructor() {
    this.anonymousClient = null;
    this.databaseKey = process.env.FUSION_PROJECT_SUPABASE_DATABASE_KEY;
    this.databaseUrl = process.env.FUSION_PROJECT_SUPABASE_DATABASE_URL;
    this.storageName = process.env.FUSION_PROJECT_SUPABASE_STORAGE_NAME;
    this.storageUrl = process.env.FUSION_PROJECT_SUPABASE_STORAGE_URL;
  }

  // -- INQUIRIES

  getFileUrl(filePath: string): string {
    return (this.storageUrl ?? "") + "/" + filePath;
  }

  // -- OPERATIONS

  getAnonymousClient(request?: CookieCapableRequest, reply?: CookieCapableReply) {
    if (this.anonymousClient === null) {
      // Supabase SSR types vary across versions; keep runtime behavior and relax typing at the boundary.
      const create = createServerClient as unknown as (...args: any[]) => any;
      this.anonymousClient = create(this.databaseUrl ?? "", this.databaseKey ?? "", {
        cookies: {
          getAll: () => [],
          setAll: () => undefined,
        },
      });
    }

    return this.anonymousClient;
  }

  getAuthenticatedClient(request?: CookieCapableRequest, reply?: CookieCapableReply) {
    const create = createServerClient as unknown as (...args: any[]) => any;

    const getAll = (): CookieLike[] => {
      if (request && request.cookies) {
        return Object.keys(request.cookies).map(
          (key): CookieLike => ({
            name: key,
            value: decodeURIComponent(request.cookies?.[key] ?? ""),
          }),
        );
      }
      return [];
    };

    const setAll = (cookies: CookieLike[]) => {
      if (!reply) return;
      for (const cookie of cookies) {
        reply.setCookie(cookie.name, encodeURIComponent(cookie.value), {
          ...(cookie.options ?? {}),
          sameSite: "Lax",
          httpOnly: true,
        });
      }
    };

    return create(this.databaseUrl ?? "", this.databaseKey ?? "", {
      cookies: { getAll, setAll },
    });
  }

  getClient(request?: CookieCapableRequest, reply?: CookieCapableReply) {
    if (!request || !reply) {
      return this.getAnonymousClient(request, reply);
    }
    return this.getAuthenticatedClient(request, reply);
  }

  async uploadFile(localFile: ArrayBuffer | Uint8Array, storageFilePath: string, storageFileIsOverwritten = false) {
    const { data, error } = await this.getClient(null, null)
      .storage.from(this.storageName ?? "")
      .upload(storageFilePath, localFile, {
        cacheControl: "3600",
        upsert: storageFileIsOverwritten,
      });

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  async copyFile(localFile: string | Uint8Array, storageFilePath: string, storageFileIsOverwritten = false) {
    let fileData: Uint8Array;

    if (typeof localFile === "string") {
      fileData = await fs.readFile(localFile);
    } else {
      fileData = localFile;
    }

    return await this.uploadFile(fileData, storageFilePath, storageFileIsOverwritten);
  }

  async removeFile(storageFilePath: string) {
    const { data, error } = await this.getClient(null, null).storage.from(this.storageName ?? "").remove([storageFilePath]);

    if (error !== null) {
      logError(error);
    }

    return data;
  }

  async signUpUser(email: string, password: string) {
    // Supabase typings differ across versions; keep return as unknown-ish for now.
    const { data, error } = await this.getClient(null, null).auth.signUp({ email, password });

    if (error !== null) {
      logError(error);
    }

    return (data as unknown as { user?: unknown } | null)?.user ?? null;
  }

  async signInUser(email: string, password: string) {
    const { data, error } = await this.getClient(null, null).auth.signInWithPassword({ email, password });

    if (error !== null) {
      logError(error);
    }

    return (data as unknown as { user?: unknown } | null)?.user ?? null;
  }

  async signOutUser(): Promise<void> {
    const { error } = await this.getClient(null, null).auth.signOut();

    if (error !== null) {
      logError(error);
    }
  }
}

// -- VARIABLES

export const supabaseService = new SupabaseService();


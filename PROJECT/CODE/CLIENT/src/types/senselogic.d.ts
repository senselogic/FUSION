declare module 'senselogic-lingo' {
  export function getLocalizedText(
    text?: string | null,
    valueByNameMap?: Record<string, unknown> | string,
    languageTag?: string,
    defaultLanguageTag?: string
  ): string | null | undefined;

  export function getTranslatedText(
    multilingualText: string,
    valueByNameMap?: Record<string, unknown> | string,
    languageTag?: string,
    defaultLanguageTag?: string
  ): string;

  export function getLanguageCode(): string;
  export function setLanguageCode(languageCode: string): void;
  export function setLanguageSeparator(languageSeparator: string): void;
  export function getBrowserLanguageCode(
    browserLanguageText: string,
    validLanguageCodeArray: string[],
    defaultLanguageCode?: string
  ): string;
}

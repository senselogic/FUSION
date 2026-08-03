declare module "senselogic-lingo"
{
    // -- TYPES

    type ValueByNameMap = Record<string, string | number>;

    // ~~

    interface Translation
    {
        specifier: string;
        data: string;
    }

    // ~~

    interface TranslatedNumberOptions
    {
        unit?: string;
        currency?: string;
        usesGrouping?: boolean;
        minimumIntegerDigitCount?: number;
        minimumFractionalDigitCount?: number;
        maximumFractionalDigitCount?: number;
    }

    // ~~

    interface TranslatedDateOptions
    {
        dayPattern?: string;
        monthPattern?: string;
        yearPattern?: string;
        timeZone?: string;
    }

    // ~~

    interface TranslatedTimeOptions
    {
        hourPattern?: string;
        minutePattern?: string;
        secondPattern?: string;
        timeZone?: string;
    }

    // -- EXPORTS

    export function getUnaccentedCharacter(
        character: string,
        languageCode?: string,
        nextCharacterIsLowerCase?: boolean
        ): string;

    // ~~

    export function getUnaccentedText(
        text: string,
        languageCode?: string
        ): string;

    // ~~

    export function setTextBySlug(
        text: string,
        textSlug: string
        ): void;

    // ~~

    export function getTextBySlug(
        textSlug: string
        ): string;

    // ~~

    export function getContinentCodeFromCountryCode(
        countryCode: string
        ): string;

    // ~~

    export function getContinentSlugFromContinentCode(
        continentCode: string
        ): string;

    // ~~

    export function setLanguageSeparator(
        languageSeparator: string
        ): void;

    // ~~

    export function getLanguageSeparator(
        ): string;

    // ~~

    export function setLanguageTag(
        languageTag: string
        ): void;

    // ~~

    export function getLanguageTag(
        ): string;

    // ~~

    export function updateLanguageTag(
        ): void;

    // ~~

    export function setContinentCode(
        continentCode: string
        ): void;

    // ~~

    export function getContinentCode(
        ): string;

    // ~~

    export function setCountryCode(
        countryCode: string
        ): void;

    // ~~

    export function getCountryCode(
        ): string;

    // ~~

    export function setLanguageCode(
        languageCode: string
        ): void;

    // ~~

    export function getLanguageCode(
        ): string;

    // ~~

    export function setDefaultLanguageCode(
        defaultLanguageCode: string
        ): void;

    // ~~

    export function getDefaultLanguageCode(
        ): string;

    // ~~

    export function setSubstitutionPrefix(
        substitutionPrefix: string
        ): void;

    // ~~

    export function getSubstitutionPrefix(
        ): string;

    // ~~

    export function setSubstitutionSuffix(
        substitutionSuffix: string
        ): void;

    // ~~

    export function getSubstitutionSuffix(
        ): string;

    // ~~

    export function getBrowserLanguageCode(
        browserLanguageText: string,
        validLanguageCodeArray: string[],
        defaultLanguageCode?: string
        ): string;

    // ~~

    export function getTrimmedLanguageTag(
        languageTag: string
        ): string;

    // ~~

    export function getUntranslatedText(
        multilingualText: string
        ): string;

    // ~~

    export function matchesLanguageSpecifier(
        languageSpecifier: string,
        languageTag: string
        ): boolean;

    // ~~

    export function matchesValueSpecifier(
        valueSpecifier: string,
        valueByNameMap?: ValueByNameMap
        ): boolean;

    // ~~

    export function matchesConditionSpecifier(
        specifier: string,
        valueByNameMap?: ValueByNameMap
        ): boolean;

    // ~~

    export function matchesTranslationSpecifier(
        translationSpecifier: string,
        valueByNameMap: ValueByNameMap | undefined,
        languageTag: string
        ): boolean;

    // ~~

    export function getSubstitutedText(
        text: string,
        valueByNameMap?: ValueByNameMap
        ): string;

    // ~~

    export function getTranslatedCountryName(
        countryCode: string
        ): string;

    // ~~

    export function getTranslatedCurrencyName(
        currencyCode: string
        ): string;

    // ~~

    export function getTranslatedDate(
        date: Date,
        options?: TranslatedDateOptions
        ): string;

    // ~~

    export function getTranslatedLanguageName(
        languageCode: string
        ): string;

    // ~~

    export function getTranslatedNumber(
        number: number,
        options?: TranslatedNumberOptions
        ): string;

    // ~~

    export function getTranslatedText(
        multilingualText: string,
        valueByNameMap?: ValueByNameMap | string,
        languageTag?: string,
        defaultLanguageTag?: string
        ): string;

    // ~~

    export function getTranslatedTime(
        time: Date,
        options?: TranslatedTimeOptions
        ): string;

    // ~~

    export function getLanguageDecimalSeparator(
        languageCode: string
        ): string;

    // ~~

    export function isMultilingualText(
        multilingualText: unknown
        ): multilingualText is string;

    // ~~

    export function getTranslationArray(
        multilingualText: string
        ): Translation[];

    // ~~

    export function getNextLanguageTag(
        languageTagArray: string[],
        translationArray: Translation[]
        ): string;

    // ~~

    export function getMultilingualText(
        translationArray: Translation[]
        ): string;

    // ~~

    export function getLocalizedText<Text extends string | null | undefined = undefined>(
        text?: Text,
        valueByNameMap?: ValueByNameMap | string,
        languageTag?: string,
        defaultLanguageTag?: string
        ): Text;

    // ~~

    export function getLocalizedTextBySlug(
        textSlug: string,
        valueByNameMap?: ValueByNameMap | string,
        languageTag?: string,
        defaultLanguageTag?: string
        ): string;

    // ~~

    export function defineLineTag(
        name: string,
        openingDefinition: string,
        innerDefinition: string,
        closingDefinition?: string
        ): void;

    // ~~

    export function defineDualTag(
        name: string,
        openingDefinition: string,
        closingDefinition: string
        ): void;

    // ~~

    export function defineTag(
        name: string,
        definition: string
        ): void;

    // ~~

    export function defineColorTag(
        name: string,
        color?: string
        ): void;

    // ~~

    export function getProcessedText(
        text: string
        ): string;

    // ~~

    export function getProcessedMultilineText(
        text: string
        ): string;

    // ~~

    export function getProcessedLocalizedText(
        text: string,
        valueByNameMap?: ValueByNameMap | string,
        languageTag?: string,
        defaultLanguageTag?: string
        ): string;

    // ~~

    export function getProcessedLocalizedMultilineText(
        text: string,
        valueByNameMap?: ValueByNameMap | string,
        languageTag?: string,
        defaultLanguageTag?: string
        ): string;

    // ~~

    export function getProcessedLocalizedTextBySlug(
        textSlug: string,
        valueByNameMap?: ValueByNameMap | string,
        languageTag?: string,
        defaultLanguageTag?: string
        ): string;

    // ~~

    export function getProcessedLocalizedMultilineTextBySlug(
        textSlug: string,
        valueByNameMap?: ValueByNameMap | string,
        languageTag?: string,
        defaultLanguageTag?: string
        ): string;
}

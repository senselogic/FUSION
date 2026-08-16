// -- IMPORTS

import {
    getLocalizedText,
    setLanguageSeparator
} from "senselogic-lingo";

// -- CONSTANTS

export const platform = 'web';
export const hostUrl = '';
export const defaultLanguageTag = "en";
export const validLanguageTagArray = [ "en", "fr" ];

// -- VARIABLES

export const monthNameArray =
    [
        "January¨fr:Janvier",
        "February¨fr:Février",
        "March¨fr:Mars",
        "April¨fr:Avril",
        "May¨fr:May",
        "June¨fr:Juin",
        "July¨fr:Juillet",
        "August¨fr:Août",
        "September¨fr:Septembre",
        "October¨fr:Octobre",
        "November¨fr:Novembre",
        "December¨fr:Décembre"
    ];

export const weekdayNameArray =
    [
        "Monday¨fr:Lundi",
        "Tuesday¨fr:Mardi",
        "Wednesday¨fr:Mercredi",
        "Thursday¨fr:Jeudi",
        "Friday¨fr:Vendredi",
        "Saturday¨fr:Samedi",
        "Sunday¨fr:Dimanche"
    ];

// -- FUNCTIONS

export function getHostRoute(
    route: string
): string
{
    return hostUrl + route;
}

// ~~

export function getShortenedName(
    name: string,
    maximumCharacterCount: number | undefined = undefined
): string
{
    if ( maximumCharacterCount === undefined )
    {
        return name;
    }
    else
    {
        return name.slice( 0, maximumCharacterCount );
    }
}

// ~~

export function getLocalizedNameArray(
    nameArray: string[],
    languageTag: string,
    maximumCharacterCount: number | undefined = undefined
): string[]
{
    return nameArray.map(
        (
            name: string
        ): string =>
            getShortenedName(
                getLocalizedText( name, languageTag ),
                maximumCharacterCount
                )
        );
}

// ~~

export function getLocalizedMonthNameArray(
    languageTag: string,
    maximumCharacterCount: number | undefined = undefined
): string[]
{
    return getLocalizedNameArray( monthNameArray, languageTag, maximumCharacterCount );
}

// ~~

export function getLocalizedWeekdayNameArray(
    languageTag: string,
    maximumCharacterCount: number | undefined = undefined
): string[]
{
    return getLocalizedNameArray( weekdayNameArray, languageTag, maximumCharacterCount );
}

// ~~

export function getLocalizedMonthName(
    monthIndex: number,
    languageTag: string,
    maximumCharacterCount: number | undefined = undefined
): string
{
    return getShortenedName(
        getLocalizedText( monthNameArray[ monthIndex ], languageTag ),
        maximumCharacterCount
        );
}

// ~~

export function getLocalizedWeekdayName(
    weekdayIndex: number,
    languageTag: string,
    maximumCharacterCount: number | undefined = undefined
): string
{
    return getShortenedName(
        getLocalizedText( weekdayNameArray[ weekdayIndex ], languageTag ),
        maximumCharacterCount
        );
}

// -- STATEMENTS

setLanguageSeparator( "¨" );

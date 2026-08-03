// -- IMPORTS

import {
  getLocalizedText,
  getLanguageCode,
  setLanguageCode,
  setLanguageSeparator
} from "senselogic-lingo";
import { Capacitor } from "@capacitor/core";

// -- CONSTANTS

export const platform = Capacitor.getPlatform();
export const hostUrl = platform === "android" ? "https://fusion-project.com/" : "";
export const defaultLanguageCode = "en";
export const validLanguageCodeArray = [ "en", "fr" ];

// -- VARIABLES

export const monthNameArray = [
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
  "December¨fr:Décembre",
];

export const weekdayNameArray = [
  "Monday¨fr:Lundi",
  "Tuesday¨fr:Mardi",
  "Wednesday¨fr:Mercredi",
  "Thursday¨fr:Jeudi",
  "Friday¨fr:Vendredi",
  "Saturday¨fr:Samedi",
  "Sunday¨fr:Dimanche",
];

// -- FUNCTIONS

export function getHostRoute(route: string): string {
  return hostUrl + route;
}

export function getShortenedName(name: string, maximumCharacterCount: number | undefined = undefined): string {
  if (maximumCharacterCount === undefined) {
    return name;
  }
  return name.slice(0, maximumCharacterCount);
}

export function getLocalizedNameArray(nameArray: string[], maximumCharacterCount: number | undefined = undefined): string[] {
  return nameArray.map((name) => getShortenedName(getLocalizedText(name), maximumCharacterCount));
}

export function getLocalizedMonthNameArray(maximumCharacterCount: number | undefined = undefined): string[] {
  return getLocalizedNameArray(monthNameArray, maximumCharacterCount);
}

export function getLocalizedWeekdayNameArray(maximumCharacterCount: number | undefined = undefined): string[] {
  return getLocalizedNameArray(weekdayNameArray, maximumCharacterCount);
}

export function getLocalizedMonthName(monthIndex: number, maximumCharacterCount: number | undefined = undefined): string {
  return getShortenedName(getLocalizedText(monthNameArray[monthIndex]), maximumCharacterCount);
}

export function getLocalizedWeekdayName(weekdayIndex: number, maximumCharacterCount: number | undefined = undefined): string {
  return getShortenedName(getLocalizedText(weekdayNameArray[weekdayIndex]), maximumCharacterCount);
}

// -- STATEMENTS

setLanguageSeparator( "¨" );
setLanguageCode( getLanguageCode() || defaultLanguageCode );

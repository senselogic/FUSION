// -- IMPORTS

import { getBrowserLanguageCode } from "senselogic-lingo";
import type { LayoutServerLoad } from './$types';

// -- CONSTANTS

const defaultLanguageCode = "en";
const validLanguageCodeArray =
    [
        "en",
        "fr"
    ];

// -- FUNCTIONS

export const load: LayoutServerLoad = (
    {
        request
    }
) =>
{
    let acceptLanguageText = request.headers.get( "accept-language" ) ?? defaultLanguageCode;

    return (
        {
            languageCode:
                getBrowserLanguageCode(
                    acceptLanguageText,
                    validLanguageCodeArray,
                    defaultLanguageCode
                    )
        }
        );
};

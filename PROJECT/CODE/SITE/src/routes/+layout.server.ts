// -- IMPORTS

import { getBrowserLanguageCode } from "senselogic-lingo";
import type { LayoutServerLoad } from './$types';

// -- CONSTANTS

const defaultLanguageTag = "en";
const validLanguageTagArray =
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
    let acceptLanguageText = request.headers.get( "accept-language" ) ?? defaultLanguageTag;

    return (
        {
            languageTag:
                getBrowserLanguageCode(
                    acceptLanguageText,
                    validLanguageTagArray,
                    defaultLanguageTag
                    )
        }
        );
};

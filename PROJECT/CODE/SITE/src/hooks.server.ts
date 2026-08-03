// -- IMPORTS

import type { Handle } from "@sveltejs/kit";
import dotenv from "dotenv";
import { setLanguageSeparator } from "senselogic-lingo";

// -- CONSTANTS

const corsHeaderRecord: Record<string, string> =
    {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

// -- STATEMENTS

dotenv.config();
setLanguageSeparator( "¨" );

// -- FUNCTIONS

export const handle: Handle = async (
    {
        event,
        resolve
    }
) =>
{
    if ( event.request.method === "OPTIONS" )
    {
        return new Response(
            null,
            {
                status: 204,
                headers: corsHeaderRecord
            }
            );
    }

    let response = await resolve( event );

    for ( let [ headerName, headerValue ] of Object.entries( corsHeaderRecord ) )
    {
        response.headers.set( headerName, headerValue );
    }

    return response;
};

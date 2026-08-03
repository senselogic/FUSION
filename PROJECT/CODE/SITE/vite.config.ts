// -- IMPORTS

import adapter from "@sveltejs/adapter-node";
import { createRequire } from "module";
import path from "path";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

// -- CONSTANTS

const require = createRequire( import.meta.url );

let senselogicFlowPackageFilePath = require.resolve( "senselogic-flow/package.json" );
let nodeModuleFolderPath = path.dirname( path.dirname( senselogicFlowPackageFilePath ) );

// -- FUNCTIONS

function getRunesMode(
    {
        filename
    }:
    {
        filename: string;
    }
): boolean | undefined
{
    if ( filename.split( /[/\\]/ ).includes( 'node_modules' ) )
    {
        return undefined;
    }
    else
    {
        return true;
    }
}

// -- STATEMENTS

export default defineConfig(
    {
        plugins:
            [
                sveltekit(
                    {
                        compilerOptions:
                            {
                                runes: getRunesMode
                            },
                        adapter: adapter(),
                        alias:
                            {
                                $client: "src/client",
                                $admin: "src/admin"
                            }
                    }
                    )
            ],
        css:
            {
                preprocessorOptions:
                    {
                        stylus:
                            {
                                paths:
                                    [
                                        nodeModuleFolderPath
                                    ]
                            }
                    }
            },
        server:
            {
                port: 8000,
                host: "0.0.0.0"
            },
        preview:
            {
                port: 8000,
                host: "0.0.0.0"
            }
    }
    );

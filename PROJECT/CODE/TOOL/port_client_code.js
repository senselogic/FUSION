// Sync CLIENT/ADMIN UI into a SvelteKit target folder and generate page routes.
// CLIENT/ADMIN page components are dual-mode (CSR fetch when props absent, SSR when props provided).
// This script only applies minimum Kit transforms (strip svelte-simple-router, Capacitor host).
// Generated trees (do not hand-edit): src/client, src/admin, src/routes/**/+page.svelte,
// src/routes/**/+page.server.ts (except customization-point layouts).
// Seeded once if missing (not overwritten if present):
//   src/routes/+layout.svelte
//   src/routes/(app)/+layout.svelte
//   src/routes/admin/+layout.svelte
// Usage: node port_client_code.js <target-folder>

// -- IMPORTS

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// -- CONSTANTS

const scriptFilePath = fileURLToPath( import.meta.url );
const scriptFolderPath = path.dirname( scriptFilePath );
const codeFolderPath = path.resolve( scriptFolderPath, '..' );
const targetFolderArgument = process.argv[ 2 ];

if ( !targetFolderArgument )
{
    throw new Error( 'Usage: node port_client_code.js <target-folder>' );
}

const targetFolderPath = path.resolve( scriptFolderPath, targetFolderArgument );
const clientFolderPath = path.join( codeFolderPath, 'CLIENT' );
const adminFolderPath = path.join( codeFolderPath, 'ADMIN' );
const targetSourceFolderPath = path.join( targetFolderPath, 'src' );
const targetStaticFolderPath = path.join( targetFolderPath, 'static' );

const skippedSourceFileNameArray =
    [
        'main.ts',
        'vite-env.d.ts',
        'App.svelte'
    ];

// -- FUNCTIONS

function ensureFolder(
    folderPath
)
{
    fs.mkdirSync( folderPath, { recursive: true } );
}

// ~~

function readTextFile(
    filePath
)
{
    return fs.readFileSync( filePath, 'utf8' );
}

// ~~

function writeTextFile(
    filePath,
    fileContent
)
{
    ensureFolder( path.dirname( filePath ) );
    fs.writeFileSync( filePath, fileContent, 'utf8' );
}

// ~~

function writeTextFileIfMissing(
    filePath,
    fileContent
)
{
    if ( fs.existsSync( filePath ) )
    {
        return false;
    }

    writeTextFile( filePath, fileContent );

    return true;
}

// ~~

function removeFolderIfExists(
    folderPath
)
{
    if ( fs.existsSync( folderPath ) )
    {
        fs.rmSync( folderPath, { recursive: true, force: true } );
    }
}

// ~~

function copyFile(
    sourceFilePath,
    targetFilePath
)
{
    ensureFolder( path.dirname( targetFilePath ) );
    fs.copyFileSync( sourceFilePath, targetFilePath );
}

// ~~

function copyPublicAssets(
    sourcePublicFolderPath,
    targetPublicFolderPath
)
{
    if ( !fs.existsSync( sourcePublicFolderPath ) )
    {
        return;
    }

    let entryArray = fs.readdirSync( sourcePublicFolderPath, { withFileTypes: true } );

    for ( let entry of entryArray )
    {
        let sourceEntryPath = path.join( sourcePublicFolderPath, entry.name );
        let targetEntryPath = path.join( targetPublicFolderPath, entry.name );

        if ( entry.isDirectory() )
        {
            copyPublicAssets( sourceEntryPath, targetEntryPath );
        }
        else
        {
            copyFile( sourceEntryPath, targetEntryPath );
        }
    }
}

// ~~

function transformBaseSource(
    sourceText
)
{
    let transformedText = sourceText;

    transformedText
        = transformedText.replace(
            /[ \t]*import \{ Capacitor \} from ['"]@capacitor\/core['"];\r?\n/,
            ''
            );

    transformedText
        = transformedText.replace(
            /export const platform = Capacitor\.getPlatform\(\);\r?\nexport const hostUrl = platform === ['"]android['"] \? ['"]https:\/\/fusion-project\.com\/['"] : ['"]['"];\r?\n/,
            "export const platform = 'web';\nexport const hostUrl = '';\n"
            );

    return transformedText;
}

// ~~

function stripRouterImports(
    sourceText
)
{
    let transformedText = sourceText;

    transformedText
        = transformedText.replace(
            /[ \t]*import \{ link \} from '@dvcol\/svelte-simple-router\/router';\r?\n/,
            ''
            );

    transformedText
        = transformedText.replace(
            /[ \t]*import \{ RouterView \} from '@dvcol\/svelte-simple-router\/components';\r?\n/,
            ''
            );

    transformedText = transformedText.replace( / use:link/g, '' );

    return transformedText;
}

// ~~

function transformSyncedFile(
    relativeFilePath,
    sourceText,
    linkPrefix
)
{
    let normalizedRelativeFilePath = relativeFilePath.replace( /\\/g, '/' );

    if ( normalizedRelativeFilePath === 'lib/base.ts' )
    {
        return transformBaseSource( sourceText );
    }

    if ( normalizedRelativeFilePath.endsWith( '.svelte' )
        || normalizedRelativeFilePath.endsWith( '.ts' ) )
    {
        return stripRouterImports( sourceText );
    }

    return sourceText;
}

// ~~

function syncSourceTree(
    sourceRootFolderPath,
    targetRootFolderPath,
    linkPrefix
)
{
    removeFolderIfExists( targetRootFolderPath );
    ensureFolder( targetRootFolderPath );

    function walk(
        sourceFolderPath,
        targetFolderPath,
        relativeFolderPath
    )
    {
        let entryArray = fs.readdirSync( sourceFolderPath, { withFileTypes: true } );

        for ( let entry of entryArray )
        {
            if ( skippedSourceFileNameArray.includes( entry.name ) )
            {
                continue;
            }

            let sourceEntryPath = path.join( sourceFolderPath, entry.name );
            let targetEntryPath = path.join( targetFolderPath, entry.name );
            let relativeEntryPath
                = relativeFolderPath === ''
                    ? entry.name
                    : path.join( relativeFolderPath, entry.name );

            if ( entry.isDirectory() )
            {
                ensureFolder( targetEntryPath );
                walk( sourceEntryPath, targetEntryPath, relativeEntryPath );
            }
            else
            {
                let sourceText = readTextFile( sourceEntryPath );
                let transformedText
                    = transformSyncedFile(
                        relativeEntryPath,
                        sourceText,
                        linkPrefix
                        );

                writeTextFile( targetEntryPath, transformedText );
            }
        }
    }

    let sourceSrcFolderPath = path.join( sourceRootFolderPath, 'src' );

    if ( !fs.existsSync( sourceSrcFolderPath ) )
    {
        throw new Error( `Source src folder not found: ${ sourceSrcFolderPath }` );
    }

    walk( sourceSrcFolderPath, targetRootFolderPath, '' );
}

// ~~

function writePageServerLoad(
    routeFolderPath,
    apiPathExpression
)
{
    let filePath = path.join( routeFolderPath, '+page.server.ts' );
    let source
        = `// GENERATED by TOOL/update_client_code.js — do not hand-edit.

// -- IMPORTS

import type { PageServerLoad } from './$types';

// -- FUNCTIONS

export const load: PageServerLoad = async (
    {
        fetch,
        params
    }
) =>
{
    let apiPath = ${ apiPathExpression };
    let response = await fetch(
        apiPath,
        {
            method: 'POST'
        }
        );

    if ( !response.ok )
    {
        throw new Error( \`API request failed: \${ apiPath } (\${ response.status })\` );
    }

    return await response.json();
};
`;

    writeTextFile( filePath, source );
}

// ~~

function writePageComponent(
    routeFolderPath,
    componentImportPath,
    propBindingSource
)
{
    let filePath = path.join( routeFolderPath, '+page.svelte' );
    let source
        = `<script lang="ts">
    // GENERATED by TOOL/update_client_code.js — do not hand-edit.

    // -- IMPORTS

    import PageComponent from '${ componentImportPath }';

    // -- VARIABLES

    let { data } = $props();
</script>

<PageComponent ${ propBindingSource } />
`;

    writeTextFile( filePath, source );
}

// ~~

function writeGeneratedRoutes(
)
{
    let routesFolderPath = path.join( targetSourceFolderPath, 'routes' );

    // Public app routes under (app) group
    let appHomeFolderPath = path.join( routesFolderPath, '(app)' );
    let appPropertiesFolderPath = path.join( routesFolderPath, '(app)', 'properties' );
    let appPropertyFolderPath = path.join( routesFolderPath, '(app)', 'property', '[id]' );

    writePageServerLoad( appHomeFolderPath, "'/api/page/home'" );
    writePageComponent(
        appHomeFolderPath,
        '$client/lib/page/HomePage.svelte',
        'favoritePropertyArray={ data.favoritePropertyArray } languageTag={ data.languageTag }'
        );

    writePageServerLoad( appPropertiesFolderPath, "'/api/page/properties'" );
    writePageComponent(
        appPropertiesFolderPath,
        '$client/lib/page/PropertiesPage.svelte',
        'propertyArray={ data.propertyArray } languageTag={ data.languageTag }'
        );

    writePageServerLoad( appPropertyFolderPath, "`/api/page/property/${ params.id }`" );
    writeTextFile(
        path.join( appPropertyFolderPath, '+page.svelte' ),
        `<script lang="ts">
    // GENERATED by TOOL/update_client_code.js — do not hand-edit.

    // -- IMPORTS

    import { page } from '$app/stores';
    import PageComponent from '$client/lib/page/PropertyPage.svelte';

    // -- VARIABLES

    let { data } = $props();
</script>

<PageComponent id={ $page.params.id ?? '' } property={ data.property } languageTag={ data.languageTag } />
`
        );

    // Admin routes
    let adminHomeFolderPath = path.join( routesFolderPath, 'admin' );
    let adminPropertiesFolderPath = path.join( routesFolderPath, 'admin', 'properties' );
    let adminPropertyFolderPath = path.join( routesFolderPath, 'admin', 'property', '[id]' );

    writePageServerLoad( adminHomeFolderPath, "'/api/page/home'" );
    writePageComponent(
        adminHomeFolderPath,
        '$admin/lib/page/HomePage.svelte',
        'favoritePropertyArray={ data.favoritePropertyArray } languageTag={ data.languageTag }'
        );

    writePageServerLoad( adminPropertiesFolderPath, "'/api/page/properties'" );
    writePageComponent(
        adminPropertiesFolderPath,
        '$admin/lib/page/PropertiesPage.svelte',
        'propertyArray={ data.propertyArray } languageTag={ data.languageTag }'
        );

    writePageServerLoad( adminPropertyFolderPath, "`/api/page/property/${ params.id }`" );
    writeTextFile(
        path.join( adminPropertyFolderPath, '+page.svelte' ),
        `<script lang="ts">
    // GENERATED by TOOL/update_client_code.js — do not hand-edit.

    // -- IMPORTS

    import { page } from '$app/stores';
    import PageComponent from '$admin/lib/page/PropertyPage.svelte';

    // -- VARIABLES

    let { data } = $props();
</script>

<PageComponent id={ $page.params.id ?? '' } property={ data.property } languageTag={ data.languageTag } />
`
        );

    // Remove old root +page.svelte scaffold if it sits at routes/+page.svelte (moved to (app))
    let rootPageFilePath = path.join( routesFolderPath, '+page.svelte' );

    if ( fs.existsSync( rootPageFilePath ) )
    {
        fs.unlinkSync( rootPageFilePath );
    }

    let rootPageServerFilePath = path.join( routesFolderPath, '+page.server.ts' );

    if ( fs.existsSync( rootPageServerFilePath ) )
    {
        fs.unlinkSync( rootPageServerFilePath );
    }
}

// ~~

function writeCustomizationLayouts(
)
{
    let routesFolderPath = path.join( targetSourceFolderPath, 'routes' );

    writeTextFileIfMissing(
        path.join( routesFolderPath, '+layout.svelte' ),
        `<script lang="ts">
    // CUSTOMIZATION POINT — not overwritten by update_client_code.js

    // -- IMPORTS

    import favicon from '$lib/assets/favicon.svg';

    // -- VARIABLES

    let { children } = $props();
</script>

<svelte:head>
    <link rel="icon" href={ favicon } />
</svelte:head>

{@render children()}
`
        );

    writeTextFileIfMissing(
        path.join( routesFolderPath, '(app)', '+layout.svelte' ),
        `<script lang="ts">
    // CUSTOMIZATION POINT — not overwritten by update_client_code.js

    // -- IMPORTS

    import '$client/app.styl';

    // -- VARIABLES

    let { children } = $props();
</script>

<img class="logo" src="/logo.png" alt="logo">
<nav>
    <a href="/">Home</a>
    <a href="/properties">Properties</a>
</nav>
<div>
    {@render children()}
</div>
`
        );

    writeTextFileIfMissing(
        path.join( routesFolderPath, 'admin', '+layout.svelte' ),
        `<script lang="ts">
    // CUSTOMIZATION POINT — not overwritten by update_client_code.js

    // -- IMPORTS

    import '$admin/app.styl';

    // -- VARIABLES

    let { children } = $props();
</script>

<img class="logo" src="/admin/logo.png" alt="logo">
<nav>
    <a href="/admin">Home</a>
    <a href="/admin/properties">Properties</a>
</nav>
<div>
    {@render children()}
</div>
`
        );
}

// ~~

function updateClientCode(
)
{
    console.log( 'Updating client/admin code into', targetFolderPath );

    syncSourceTree(
        clientFolderPath,
        path.join( targetSourceFolderPath, 'client' ),
        ''
        );
    syncSourceTree(
        adminFolderPath,
        path.join( targetSourceFolderPath, 'admin' ),
        '/admin'
        );

    copyPublicAssets(
        path.join( clientFolderPath, 'public' ),
        targetStaticFolderPath
        );
    copyPublicAssets(
        path.join( adminFolderPath, 'public' ),
        path.join( targetStaticFolderPath, 'admin' )
        );

    writeGeneratedRoutes();
    writeCustomizationLayouts();

    console.log( 'Client/admin update complete.' );
}

// -- STATEMENTS

updateClientCode();

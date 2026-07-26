<script lang="ts">
    // -- IMPORTS

    import { getLanguageCode, getLocalizedText, setLanguageCode, setLanguageSeparator } from 'senselogic-lingo';
    import axios from 'axios';
    import type { PropertyDto, PropertyPageResponseDto } from '../api_types';

    // -- VARIABLES

    let {
        id,
        property: initialProperty = undefined,
        languageCode = getLanguageCode()
    }:
    {
        id: string;
        property?: PropertyDto | null;
        languageCode?: string;
    } = $props();

    let property = $state<PropertyDto | null>( initialProperty === undefined ? null : initialProperty );
    let isLoading = $state( initialProperty === undefined );

    // -- STATEMENTS

    setLanguageSeparator( '¨' );

    $effect.pre(
        () =>
        {
            setLanguageCode( languageCode );
        }
        );

    $effect(
        () =>
        {
            if ( initialProperty !== undefined )
            {
                property = initialProperty;
                isLoading = false;

                return;
            }

            if ( !id )
            {
                return;
            }

            isLoading = true;
            property = null;

            let loadProperty = async (
            ): Promise<void> =>
            {
                try
                {
                    let response = await axios.post<PropertyPageResponseDto>( '/api/page/property/' + id );
                    property = response.data.property;
                }
                catch ( error )
                {
                    console.error( 'Error :', error );
                }
                finally
                {
                    isLoading = false;
                }
            };

            loadProperty();
        }
        );
</script>

<style>
    .hourglass
    {
    }
</style>

{#if isLoading }
    <div class="hourglass">Loading...</div>
{:else if property}
    <div>
        <h1>{ getLocalizedText( property.title, languageCode ) }</h1>
        <p>{ getLocalizedText( property.description ?? '', languageCode ) }</p>
    </div>
{:else}
    <div>Property not found</div>
{/if}

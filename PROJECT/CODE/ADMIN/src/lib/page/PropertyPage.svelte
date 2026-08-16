<script lang="ts">
    // -- IMPORTS

    import { getLocalizedText, setLanguageSeparator } from 'senselogic-lingo';
    import axios from 'axios';
    import { defaultLanguageTag } from '../base';
    import type { PropertyDto, PropertyPageResponseDto } from '../api_types';

    // -- VARIABLES

    let {
        id,
        property: initialProperty = undefined,
        languageTag = defaultLanguageTag
    }:
    {
        id: string;
        property?: PropertyDto | null;
        languageTag?: string;
    } = $props();

    let property = $state<PropertyDto | null>( initialProperty === undefined ? null : initialProperty );
    let isLoading = $state( initialProperty === undefined );

    // -- STATEMENTS

    setLanguageSeparator( '¨' );

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
        <h1>{ getLocalizedText( property.title, languageTag ) }</h1>
        <p>{ getLocalizedText( property.description ?? '', languageTag ) }</p>
    </div>
{:else}
    <div>Property not found</div>
{/if}

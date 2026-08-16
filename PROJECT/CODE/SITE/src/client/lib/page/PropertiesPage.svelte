<script lang="ts">
    // -- IMPORTS

    import axios from 'axios';
    import { getLocalizedText, setLanguageSeparator } from 'senselogic-lingo';
    import { onMount } from 'svelte';
    import { defaultLanguageTag, getHostRoute } from '../base';
    import type { PropertiesPageResponseDto, PropertyDto } from '../api_types';

    // -- VARIABLES

    let {
        propertyArray: initialPropertyArray = undefined,
        languageTag = defaultLanguageTag
    }:
    {
        propertyArray?: PropertyDto[] | null;
        languageTag?: string;
    } = $props();

    let propertyArray = $state<PropertyDto[]>( initialPropertyArray ?? [] );
    let isLoading = $state( initialPropertyArray === undefined );

    // -- STATEMENTS

    setLanguageSeparator( '¨' );

    $effect(
        () =>
        {
            if ( initialPropertyArray !== undefined )
            {
                propertyArray = initialPropertyArray ?? [];
                isLoading = false;
            }
        }
        );

    onMount(
        async () =>
        {
            if ( initialPropertyArray !== undefined )
            {
                return;
            }

            try
            {
                let response = await axios.post<PropertiesPageResponseDto>( getHostRoute( '/api/page/properties' ) );
                propertyArray = response.data.propertyArray ?? [];
            }
            catch ( error )
            {
                console.error( 'Error :', error );
            }
            finally
            {
                isLoading = false;
            }
        }
        );
</script>

<style>
    .hourglass
    {
    }

    .property
    {
    }
</style>

{#if isLoading }
    <div class="hourglass">Loading...</div>
{:else}
    <div>
        <h1>Properties</h1>
        {#each propertyArray as property }
            <a href={ '/property/' + property.id }>
                <div class="property">
                    <p>{ getLocalizedText( property.title, languageTag ) }</p>
                </div>
            </a>
        {/each}
    </div>
{/if}

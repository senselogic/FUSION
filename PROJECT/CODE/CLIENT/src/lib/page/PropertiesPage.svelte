<script lang="ts">
    // -- IMPORTS

    import axios from 'axios';
    import { getLanguageCode, getLocalizedText, setLanguageCode, setLanguageSeparator } from 'senselogic-lingo';
    import { onMount } from 'svelte';
    import { link } from '@dvcol/svelte-simple-router/router';
    import { getHostRoute } from '../base';
    import type { PropertiesPageResponseDto, PropertyDto } from '../api_types';

    // -- VARIABLES

    let {
        propertyArray: initialPropertyArray = undefined,
        languageCode = getLanguageCode()
    }:
    {
        propertyArray?: PropertyDto[] | null;
        languageCode?: string;
    } = $props();

    let propertyArray = $state<PropertyDto[]>( initialPropertyArray ?? [] );
    let isLoading = $state( initialPropertyArray === undefined );

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
            <a href={ '/property/' + property.id } use:link>
                <div class="property">
                    <p>{ getLocalizedText( property.title, languageCode ) }</p>
                </div>
            </a>
        {/each}
    </div>
{/if}

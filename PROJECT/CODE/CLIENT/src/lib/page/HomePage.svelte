<script lang="ts">
    // -- IMPORTS

    import axios from 'axios';
    import { getLocalizedText, setLanguageSeparator } from 'senselogic-lingo';
    import { onMount } from 'svelte';
    import { link } from '@dvcol/svelte-simple-router/router';
    import { defaultLanguageTag, getHostRoute } from '../base';
    import type { HomePageResponseDto, PropertyDto } from '../api_types';

    // -- VARIABLES

    let {
        favoritePropertyArray: initialFavoritePropertyArray = undefined,
        languageTag = defaultLanguageTag
    }:
    {
        favoritePropertyArray?: PropertyDto[] | null;
        languageTag?: string;
    } = $props();

    let favoritePropertyArray = $state<PropertyDto[]>( initialFavoritePropertyArray ?? [] );
    let isLoading = $state( initialFavoritePropertyArray === undefined );

    // -- STATEMENTS

    setLanguageSeparator( '¨' );

    $effect(
        () =>
        {
            if ( initialFavoritePropertyArray !== undefined )
            {
                favoritePropertyArray = initialFavoritePropertyArray ?? [];
                isLoading = false;
            }
        }
        );

    onMount(
        async () =>
        {
            if ( initialFavoritePropertyArray !== undefined )
            {
                return;
            }

            try
            {
                let response = await axios.post<HomePageResponseDto>( getHostRoute( '/api/page/home' ) );
                favoritePropertyArray = response.data.favoritePropertyArray ?? [];
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
        <h1>Favorite Properties</h1>
        {#each favoritePropertyArray as property }
            <a href={ '/property/' + property.id } use:link>
                <div class="property">
                    <p>{ getLocalizedText( property.title, languageTag ) }</p>
                </div>
            </a>
        {/each}
        <a href="/properties" use:link>See more</a>
    </div>
{/if}

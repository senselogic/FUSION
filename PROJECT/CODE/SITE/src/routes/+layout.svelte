<script lang="ts">
    // CUSTOMIZATION POINT — not overwritten by update_client_code.js

    // -- IMPORTS

    import favicon from '$lib/assets/favicon.svg';
    import { setLanguageSeparator } from 'senselogic-lingo';

    // -- VARIABLES

    let {
        children
    } = $props();

    // -- STATEMENTS

    setLanguageSeparator( '¨' );
</script>

<svelte:head>
    <link rel="icon" href={ favicon } />
</svelte:head>

{@render children()}

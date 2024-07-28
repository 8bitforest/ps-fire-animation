<script lang="ts">
    import IconChevronDown from '../../../lib/components/icons/IconChevronDown.svelte'
    import IconFolder from '../../../lib/components/icons/IconFolder.svelte'
    import IconChevronRight from '../../../lib/components/icons/IconChevronRight.svelte'
    import IconFolderOpen from '../../../lib/components/icons/IconFolderOpen.svelte'

    export let expanded = false
    export let onChanged = () => {}
    export let folder = false

    function click() {
        expanded = !expanded
        onChanged()
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="expander" on:click={click}>
    {#if expanded}
        <IconChevronDown class="icon-chev" />
        {#if folder}
            <IconFolderOpen class="icon-folder" />
        {/if}
    {:else}
        <IconChevronRight class="icon-chev" />
        {#if folder}
            <IconFolder class="icon-folder" />
        {/if}
    {/if}
</div>

<style>
    .expander {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: stretch;
    }

    :global(.icon-chev) {
        height: 70%;
        align-self: center;
    }

    :global(.icon-folder) {
        margin-right: 3px;
        height: 70%;
        align-self: center;
    }
</style>

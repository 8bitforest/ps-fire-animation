<script lang="ts">
    import Text from '../../../../lib/components/Text.svelte'
    import IconVisibility from '../../../../lib/components/icons/IconVisibility.svelte'
    import { getTimelineContext, Row } from './Timeline'
    import RowExpander from '../RowExpander.svelte'

    export let rowUpdated = () => {}
    export let row: Row
    export let depth = 0

    const indentWidth = 30

    let { collapsedRowHeight } = getTimelineContext()
</script>

<div
    class="row"
    style="min-height: {$collapsedRowHeight}px; max-height: {$collapsedRowHeight}px;">
    <div class="layer-name" style="margin-left: {depth * indentWidth}px">
        {#if row.children}
            <RowExpander bind:expanded={row.expanded} onChanged={rowUpdated} />
        {:else}
            <div style="width: 22px" />
        {/if}
        <Text>{row.name}</Text>
    </div>
    <IconVisibility class="icon-visibility" />
</div>

{#if row.children && row.expanded}
    {#each row.children as child}
        <svelte:self row={child} {rowUpdated} depth={depth + 1} />
    {/each}
{/if}

<style>
    .row {
        border-top: 1px solid #262626;

        display: flex;
        flex-direction: row;
        align-items: stretch;

        padding-left: 5px;
    }

    :global(.icon-visibility) {
        margin-left: auto;
        margin-right: 5px;
        height: 70%;
        align-self: center;
    }

    .layer-name {
        display: flex;
        flex-direction: row;
        align-items: stretch;
    }
</style>

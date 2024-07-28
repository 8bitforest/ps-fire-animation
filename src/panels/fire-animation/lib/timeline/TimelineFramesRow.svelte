<script lang="ts">
    import { getRowHeightStyle, getTimelineContext, Row } from './Timeline'
    import FrameItem from '../FrameItem.svelte'

    export let frameRowWidth: number
    export let row: Row
    export let depth = 0

    let { collapsedRowHeight, expandedRowHeight, frameWidth } =
        getTimelineContext()
</script>

<div
    class="row"
    style="min-width: {frameRowWidth}px; {getRowHeightStyle(
        row,
        $collapsedRowHeight,
        $expandedRowHeight
    )}">
    {#if !row.children}
        {#each row.frames as frame (frame.id)}
            <FrameItem {row} {frame} width={$frameWidth} />
        {/each}
    {/if}
</div>

{#if row.children && row.expanded}
    {#each row.children as child}
        <svelte:self row={child} depth={depth + 1} {frameRowWidth} />
    {/each}
{/if}

<style>
    .row {
        border-bottom: 1px solid var(--color-border);

        display: flex;
        flex-direction: row;
        align-items: stretch;
    }
</style>

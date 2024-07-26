<script lang="ts">
    import type { Row } from './Timeline'
    import FrameItem from './FrameItem.svelte'

    export let frameWidth: number
    export let frameRowWidth: number
    export let row: Row
    export let depth = 0
</script>

<div class="row" style="width: {frameRowWidth}px;">
    {#if !row.children}
        {#each row.frames as frame (frame.id)}
            <FrameItem {row} {frame} width={frameWidth} />
        {/each}
    {/if}
</div>

{#if row.children && row.expanded}
    {#each row.children as child}
        <svelte:self
            row={child}
            depth={depth + 1}
            {frameWidth}
            {frameRowWidth} />
    {/each}
{/if}

<style>
    .row {
        min-height: var(--timeline-row-height);
        height: var(--timeline-row-height);
        border-top: 1px solid var(--color-border);

        display: flex;
        flex-direction: row;
        align-items: stretch;
    }
</style>

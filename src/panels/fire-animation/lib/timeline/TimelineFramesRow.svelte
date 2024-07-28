<script lang="ts">
    import {
        getMaxFrameCount,
        getRowHeightStyle,
        getTimelineContext,
        Row
    } from './Timeline'
    import FrameItem from '../FrameItem.svelte'

    export let frameRowWidth: number
    export let row: Row
    export let depth = 0

    let { collapsedRowHeight, expandedRowHeight, frameWidth } =
        getTimelineContext()

    const folderFrame = {
        id: 'folder',
        layerId: 0,
        image: ''
    }

    const folderFrames = row.children ? getMaxFrameCount(row.children) : 0
    const defaultColor = '#3a3a3a'
    let color = row.color || defaultColor
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
            <FrameItem {color} image={frame.image} width={$frameWidth} />
        {/each}
    {:else}
        <FrameItem
            {color}
            image={folderFrame.image}
            width={$frameWidth * folderFrames} />
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

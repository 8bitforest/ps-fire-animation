<script lang="ts">
    import {
        Frame,
        getMaxFrameCount,
        getRowHeight,
        getRowHeightStyle,
        getTimelineContext,
        Row
    } from './Timeline'
    import FrameItem from './FrameItem.svelte'
    import { get, writable } from 'svelte/store'

    export let frameRowWidth: number
    export let row: Row
    export let depth = 0

    let expanded = row.expanded

    let {
        collapsedRowHeight,
        expandedRowHeight,
        frameWidth,
        thumbnailResolution
    } = getTimelineContext()

    const folderFrame: Frame = {
        id: -1,
        name: 'Folder',
        layer: row.layer,
        row,
        image: writable(null),
        selected: writable(false)
    }

    const folderFrames = row.children ? getMaxFrameCount(row.children) : 0

    async function loadFrameData() {
        if (!row.frames || !$thumbnailResolution) return
        for (const frame of row.frames) {
            if (get(frame.image)) continue
            frame.image.set(
                await frame.layer.getBase64ImageData(
                    $thumbnailResolution,
                    $thumbnailResolution
                )
            )
        }
        row = row
    }

    function unloadFrameData() {
        if (!row.frames) return
        for (const frame of row.frames) frame.image.set(null)
        row = row
    }

    $: {
        if (row.frames && $expanded) {
            loadFrameData()
        } else if (!$expanded) {
            unloadFrameData()
        }
    }

    let height = 0
    $: height = getRowHeight(
        row,
        $expanded,
        $collapsedRowHeight,
        $expandedRowHeight
    )
</script>

<div
    class="row"
    style="min-width: {frameRowWidth}px; {getRowHeightStyle(
        row,
        $expanded,
        $collapsedRowHeight,
        $expandedRowHeight
    )}">
    {#if !row.children}
        {#each row.frames as frame (frame.id)}
            <FrameItem {frame} width={$frameWidth} {height} />
        {/each}
    {:else}
        <FrameItem
            frame={folderFrame}
            width={$frameWidth * folderFrames}
            {height} />
    {/if}
</div>

{#if row.children && $expanded}
    {#each row.children as child (child.id)}
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

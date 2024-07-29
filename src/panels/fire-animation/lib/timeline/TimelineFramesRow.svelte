<script lang="ts">
    import {
        Frame,
        getMaxFrameCount,
        getRowHeight,
        getRowHeightStyle,
        getTimelineContext,
        Row
    } from './Timeline'
    import FrameItem from '../FrameItem.svelte'
    import { writable } from 'svelte/store'

    export let frameRowWidth: number
    export let row: Row
    export let depth = 0

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
        image: writable(null)
    }

    const folderFrames = row.children ? getMaxFrameCount(row.children) : 0

    let loaded = false

    async function loadFrameData() {
        if (loaded || !row.frames || !$thumbnailResolution) return
        for (const frame of row.frames) {
            try {
                frame.image.set(
                    await frame.layer.getBase64ImageData(
                        $thumbnailResolution,
                        $thumbnailResolution
                    )
                )
            } catch (e) {
                frame.image.set({
                    base64: '',
                    x: 0,
                    y: 0,
                    height: 0,
                    width: 0,
                    fullHeight: 0,
                    fullWidth: 0
                })
            }
        }

        loaded = true
        row = row
    }

    function unloadFrameData() {
        if (!loaded || !row.frames) return
        for (const frame of row.frames) frame.image.set(null)
        loaded = false
        row = row
    }

    $: {
        if (row.frames && row.expanded && !loaded) {
            loadFrameData()
        } else if (!row.expanded && loaded) {
            unloadFrameData()
        }
    }

    let height = 0
    $: height = getRowHeight(row, $collapsedRowHeight, $expandedRowHeight)
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
            <FrameItem {frame} width={$frameWidth} {height} />
        {/each}
    {:else}
        <FrameItem
            frame={folderFrame}
            width={$frameWidth * folderFrames}
            {height} />
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

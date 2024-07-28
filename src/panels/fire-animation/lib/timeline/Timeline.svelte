<script lang="ts">
    import {
        getMaxFrameCount,
        TimelineConfig,
        TimelineContext,
        timelineContextKey
    } from './Timeline'
    import TimelineFramesRow from './TimelineFramesRow.svelte'
    import TimelineLayersRow from './TimelineLayersRow.svelte'
    import Text from '../../../../lib/components/Text.svelte'
    import TimelineFramesHeader from './TimelineFramesHeader.svelte'
    import TimelinePlayhead from './TimelinePlayhead.svelte'
    import TimelineCurrentFrameHighlight from './TimelineCurrentFrameHighlight.svelte'
    import { onMount, setContext } from 'svelte'
    import TimelineAddFrameRow from './TimelineAddFrameRow.svelte'
    import { Readable, writable } from 'svelte/store'
    import { scrollbarSize } from '../../../../lib/utils'
    import TimelineControls from './TimelineControls.svelte'

    export let config: TimelineConfig
    export let setScrollWidth: (width: number) => void
    export let scrollPercentage: Readable<number>

    let rows = writable(config.rows)
    $: rows.update(() => config.rows)
    let frameWidth = writable(config.frameWidth)
    $: frameWidth.update(() => config.frameWidth)
    let layerColWidth = writable(config.layerColWidth)
    $: layerColWidth.update(() => config.layerColWidth)
    let addFrameColWidth = writable(config.addFrameColWidth)
    $: addFrameColWidth.update(() => config.addFrameColWidth)
    let collapsedRowHeight = writable(config.collapsedRowHeight)
    $: collapsedRowHeight.update(() => config.collapsedRowHeight)
    let expandedRowHeight = writable(config.expandedRowHeight)
    $: expandedRowHeight.update(() => config.expandedRowHeight)
    let headIndex = writable(config.headIndex)
    $: headIndex.update(() => config.headIndex)

    let scrollOffset = writable(0)
    let frameColCount = writable(0)

    let context: TimelineContext = {
        rows,
        frameWidth,
        layerColWidth,
        addFrameColWidth,
        collapsedRowHeight,
        expandedRowHeight,
        scrollPercentage,
        scrollOffset,
        headIndex,
        frameColCount
    }
    setContext(timelineContextKey, context)

    let frameRowWidth: number
    $: {
        $frameColCount = getMaxFrameCount($rows) + config.padFrameCount
        frameRowWidth = $frameColCount * $frameWidth
        setScrollWidth(frameRowWidth + $layerColWidth + $addFrameColWidth)
    }

    let timelineElement: HTMLElement
    let timelineVisibleWidth = 0

    // clientWidth is 0 on mount, so we need to wait for it to be set
    onMount(() => {
        const interval = setInterval(() => {
            if (timelineElement?.clientWidth) {
                clearInterval(interval)
                timelineVisibleWidth = timelineElement.clientWidth
            }
        }, 10)
    })

    $: {
        $scrollOffset =
            $scrollPercentage *
            (frameRowWidth -
                timelineVisibleWidth +
                $layerColWidth +
                $addFrameColWidth +
                scrollbarSize)
    }

    function rowUpdateHandler() {
        rows.update(rows => rows)
    }
</script>

<div class="timeline" bind:this={timelineElement}>
    <div class="timeline-header">
        <div
            class="timeline-layers-header"
            style="min-width: {$layerColWidth};">
            <TimelineControls rowUpdated={rowUpdateHandler} />
        </div>
        <div class="timeline-frames-header" style="left: -{$scrollOffset}px">
            <TimelineFramesHeader />
        </div>
        <TimelinePlayhead timelineWidth={timelineVisibleWidth} {headIndex} />
    </div>
    <div class="timeline-body-container">
        <div class="timeline-body-scroll">
            <div class="timeline-body">
                <div class="layers-col" style="min-width: {$layerColWidth};">
                    {#each $rows as row}
                        <TimelineLayersRow
                            {row}
                            rowUpdated={rowUpdateHandler} />
                    {/each}
                </div>
                <div class="frames-col" style="left: -{$scrollOffset}px">
                    <TimelineCurrentFrameHighlight />
                    {#each $rows as row}
                        <TimelineFramesRow {row} {frameRowWidth} />
                    {/each}
                </div>
                <div
                    class="add-frame-col"
                    style="min-width: {$addFrameColWidth};">
                    {#each $rows as row}
                        <TimelineAddFrameRow {row} />
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .timeline {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        height: 100%;

        position: relative;
        isolation: isolate;

        background-color: var(--color-surface-2);
    }

    .timeline-header {
        flex-shrink: 0;
        background-color: var(--color-surface-1);
        border-bottom: 1px solid var(--color-border);

        display: flex;
        flex-direction: row;
        align-items: stretch;
    }

    .timeline-layers-header {
        position: relative;
        background-color: var(--color-surface-3);
        z-index: 10;
    }

    .timeline-frames-header {
        position: relative;
        align-self: flex-end;
    }

    .timeline-body-container {
        position: relative;
    }

    .timeline-body-scroll {
        height: 100%;
        overflow-y: scroll;
    }

    .timeline-body {
        display: flex;
        flex-direction: row;
        align-items: stretch;
    }

    .layers-col {
        border-right: 1px solid var(--color-border);
        background-color: var(--color-surface-1);

        position: relative;
        z-index: 10;
    }

    .frames-col {
        flex: 1 1 auto;
        min-width: 0;
        position: relative;
        z-index: -1;
    }

    .add-frame-col {
        border-left: 1px solid var(--color-border);
        background-color: var(--color-surface-3);

        position: relative;
        z-index: 10;
    }
</style>

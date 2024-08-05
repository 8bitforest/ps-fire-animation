<script lang="ts">
    import {
        getMaxFrameCount,
        TimelineConfig,
        TimelineContext,
        timelineContextKey
    } from './Timeline'
    import TimelineFramesRow from './TimelineFramesRow.svelte'
    import TimelineLayersRow from './TimelineLayersRow.svelte'
    import TimelineFramesHeader from './TimelineFramesHeader.svelte'
    import TimelinePlayhead from './TimelinePlayhead.svelte'
    import TimelineCurrentFrameHighlight from './TimelineCurrentFrameHighlight.svelte'
    import { setContext } from 'svelte'
    import TimelineAddFrameRow from './TimelineAddFrameRow.svelte'
    import { writable } from 'svelte/store'
    import { scrollbarSize } from '../../../../lib/utils'
    import TimelineControls from './TimelineControls.svelte'

    export let config: TimelineConfig

    let scrollOffset = writable(0)
    let frameColCount = writable(0)

    let context: TimelineContext = {
        ...config,
        scrollOffset,
        frameColCount
    }
    setContext(timelineContextKey, context)

    let {
        rows,
        frameWidth,
        layerColWidth,
        addFrameColWidth,
        scrollX,
        padFrameCount,
        setScrollWidth,
        timelineResized
    } = context

    let frameColWidth = 0
    let frameRowWidth: number
    $: {
        $frameColCount = getMaxFrameCount($rows) + $padFrameCount
        frameRowWidth = $frameColCount * $frameWidth
        setScrollWidth(frameRowWidth)
    }

    $: {
        $scrollOffset = $scrollX
    }

    function onTimelineResize(event: UIEvent) {
        const element = event.target as HTMLElement
        const width = element.clientWidth
        frameColWidth = width
        timelineResized(width)
    }
</script>

<div class="timeline">
    <div class="timeline-header">
        <div
            class="timeline-layers-header"
            style="min-width: {$layerColWidth};">
            <TimelineControls />
        </div>
        <div class="timeline-frames-header" style="left: -{$scrollOffset}px">
            <TimelineFramesHeader />
        </div>
        <TimelinePlayhead {frameColWidth} />
    </div>
    <div class="timeline-body-container">
        <div class="timeline-body-scroll">
            <div class="timeline-body">
                <div class="layers-col" style="min-width: {$layerColWidth};">
                    {#each $rows as row (row.id)}
                        <TimelineLayersRow {row} />
                    {/each}
                </div>
                <div
                    class="frames-col"
                    style="left: -{$scrollOffset}px"
                    on:resize={onTimelineResize}>
                    <TimelineCurrentFrameHighlight />
                    {#each $rows as row (row.id)}
                        <TimelineFramesRow {row} {frameRowWidth} />
                    {/each}
                </div>
                <div
                    class="add-frame-col-container"
                    style="min-width: {$addFrameColWidth};">
                    <div
                        class="add-frame-col"
                        style="min-width: {$addFrameColWidth + scrollbarSize}">
                        {#each $rows as row (row.id)}
                            <TimelineAddFrameRow {row} />
                        {/each}
                    </div>
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
        z-index: 5;
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
        z-index: 5;
    }

    .add-frame-col-container {
        background-color: var(--color-surface-3);
        border-left: 1px solid var(--color-border);
        position: relative;
        z-index: 10;
    }

    .add-frame-col {
        background-color: var(--color-surface-3);
    }
</style>

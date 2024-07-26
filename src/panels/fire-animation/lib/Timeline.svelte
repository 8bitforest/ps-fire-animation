<script lang="ts">
    import type { Row } from './Timeline'
    import TimelineFramesRow from './TimelineFramesRow.svelte'
    import TimelineLayersRow from './TimelineLayersRow.svelte'

    export let rows: Row[]

    function rowUpdated() {
        rows = rows
    }

    export let layerWidth: number
    export let frameWidth: number
    export let frameRowWidth: number
    export let scrollPercentage = 0
    let timelineElement: HTMLElement
    let offset = 0

    $: {
        const timelineWidth = timelineElement?.clientWidth
        offset = scrollPercentage * (frameRowWidth - timelineWidth + layerWidth)
    }
</script>

<div class="timeline" bind:this={timelineElement}>
    <div class="layers-col" style="min-width: {layerWidth};">
        {#each rows as row}
            <TimelineLayersRow {row} {rowUpdated} />
        {/each}
    </div>
    <div class="frames-col" style="left: -{offset}px">
        {#each rows as row}
            <TimelineFramesRow {row} {frameWidth} {frameRowWidth} />
        {/each}
    </div>
</div>

<style>
    :root {
        --timeline-row-height: 20px;
        --icon-fill: #aaaaaa;
    }

    .timeline {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        min-height: 100%;
        max-height: 100%;
        overflow-y: scroll;
    }

    .layers-col {
        border-right: 1px solid var(--color-border);
        background-color: var(--color-surface-1);
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }

    .frames-col {
        flex: 1 1 auto;
        background-color: var(--color-surface-2);
        position: relative;
        z-index: -1;
    }
</style>

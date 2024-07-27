<script lang="ts">
    import IconPlayhead from '../../../../lib/components/icons/IconPlayhead.svelte'
    import { getTimelineContext } from './Timeline'

    export let timelineWidth: number

    let {
        frameWidth,
        headIndex,
        scrollOffset,
        layerColWidth,
        addFrameColWidth
    } = getTimelineContext()

    let offset = 0
    $: {
        let minX = $layerColWidth
        let maxX = timelineWidth - $addFrameColWidth - 16

        const unboundedOffset =
            -$scrollOffset + $layerColWidth + $headIndex * $frameWidth
        offset = Math.min(maxX, Math.max(minX, unboundedOffset))
    }
</script>

<div class="playhead" style="left: {offset}px;">
    <div class="playhead-icon-container">
        <IconPlayhead class="playhead-icon" />
    </div>
</div>

<style>
    .playhead {
        position: absolute;
        height: 100%;
    }

    .playhead-icon-container {
        position: absolute;
        width: 50px;
        height: 50px;
        top: -1px;
        left: -25px;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
    }

    :global(.playhead-icon) {
        fill: var(--color-playhead);
        width: 20px;
        height: 20px;
        stroke: lightgray;
        stroke-width: 12;
    }
</style>

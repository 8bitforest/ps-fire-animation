<script lang="ts">
    import IconPlayhead from '../../../../lib/components/icons/IconPlayhead.svelte'
    import { getTimelineContext } from './Timeline'

    export let frameColWidth: number

    let { frameWidth, scrollOffset, layerColWidth, headIndex } =
        getTimelineContext()

    let offset = 0
    $: {
        let minX = $layerColWidth
        let maxX = $layerColWidth + frameColWidth

        const unboundedOffset =
            -$scrollOffset + $layerColWidth + $headIndex * $frameWidth
        offset = Math.min(maxX, Math.max(minX, unboundedOffset))
    }

    function handleDragStart(event: MouseEvent) {
        event.preventDefault()

        const startX = event.clientX
        const startIndex = $headIndex
        const width = $frameWidth
        let prevIndex = startIndex

        function handleDrag(event: MouseEvent) {
            event.preventDefault()
            const dx = event.clientX - startX
            const dIndex = Math.round(dx / width)
            const newIndex = Math.max(0, startIndex + dIndex)

            if (newIndex !== prevIndex) {
                prevIndex = newIndex
                headIndex.set(newIndex)
            }
        }

        function handleDragEnd() {
            window.removeEventListener('mousemove', handleDrag)
            window.removeEventListener('mouseup', handleDragEnd)
            window.removeEventListener('dragend', handleDragEnd)
        }

        window.addEventListener('mousemove', handleDrag)
        window.addEventListener('mouseup', handleDragEnd)
        window.addEventListener('dragend', handleDragEnd)
    }
</script>

<div class="playhead" style="left: {offset}px;" draggable="false">
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="playhead-icon-container"
        on:dragstart={handleDragStart}
        draggable="true">
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
        width: 30px;
        height: 30px;
        top: 7px;
        left: -15px;
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

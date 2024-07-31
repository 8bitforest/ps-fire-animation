<script lang="ts" context="module">
    const border = 1
    const margin = 2
    const padding = 4
    export const borderSize = border + margin + padding
</script>

<script lang="ts">
    import { lightenDarkenColor } from '../../../../lib/utils'
    import PSLayerThumbnail from '../PSLayerThumbnail.svelte'
    import { Frame, getTimelineContext } from './Timeline'

    export let frame: Frame
    export let width: number
    export let height: number

    const { selectFrame } = getTimelineContext()

    const defaultColor = '#3a3a3a'
    let image = frame.image
    let color = frame.row.color || defaultColor
    let borderColor = lightenDarkenColor(color, 60)

    let thumbnailHeight = 0
    let thumbnailWidth = 0

    let selectable = !frame.row.children
    let selected = frame.selected

    $: {
        if (!$image) break $
        let aspect = $image.fullWidth / $image.fullHeight
        thumbnailHeight = height - (margin + padding + border) * 2
        thumbnailWidth = thumbnailHeight * aspect
    }

    function clickHandler() {
        if (selectable) {
            selectFrame(frame)
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="timeline-frame"
    class:selectable
    class:selected={$selected}
    on:click={clickHandler}
    style="
        background-color: {color};
        border: 1px solid {borderColor};
        width: {width - 4}px;
        min-width: {width - 4}px;
    ">
    {#if $image}
        <PSLayerThumbnail
            data={$image}
            width={thumbnailWidth}
            height={thumbnailHeight} />
    {/if}
</div>

<style>
    .timeline-frame {
        margin: 2px;
        border-radius: 6px;
        position: relative;
        padding: 4px;
    }

    .selectable:hover {
        border-width: 2px !important;
    }

    .selected {
        border-color: #eeeeee !important;
        border-width: 2px !important;
    }
</style>

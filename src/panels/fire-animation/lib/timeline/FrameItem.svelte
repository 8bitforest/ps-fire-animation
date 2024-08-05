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
    import { layerColors } from '../../../../api/photoshop/layer'

    export let frame: Frame
    export let width: number
    export let height: number

    const { selectFrame } = getTimelineContext()

    const defaultGroupColor = '#3a3a3a'
    const defaultFrameColor = layerColors.violet.hex
    let image = frame.image
    $: color = !frame.row.children
        ? frame.row.color || defaultFrameColor
        : defaultGroupColor
    $: borderColor = lightenDarkenColor(color, 60)

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
        border: 2px solid {borderColor};
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
        padding: 4px;
    }

    .selectable:hover:not(.selected) {
        border-color: #cccccc !important;
    }

    .selected {
        border-color: #eeeeee !important;
    }
</style>

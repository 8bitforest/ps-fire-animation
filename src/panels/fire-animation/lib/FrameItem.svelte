<script lang="ts">
    import { lightenDarkenColor } from '../../../lib/utils'
    import PSLayerThumbnail from './PSLayerThumbnail.svelte'
    import { Frame } from './timeline/Timeline'

    export let frame: Frame
    export let width: number
    export let height: number

    const defaultColor = '#3a3a3a'
    let image = frame.image
    let color = frame.row.color || defaultColor
    let borderColor = lightenDarkenColor(color, 60)

    const border = 1
    const margin = 2
    const padding = 4

    let thumbnailHeight = 0
    let thumbnailWidth = 0

    $: {
        if (!$image) break $
        let aspect = $image.fullWidth / $image.fullHeight
        thumbnailHeight = height - (margin + padding + border) * 2
        thumbnailWidth = thumbnailHeight * aspect
    }
</script>

<div
    class="timeline-frame"
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
        background-color: var(--frame-color);
        border-radius: 6px;
        position: relative;
        padding: 4px;
    }
</style>

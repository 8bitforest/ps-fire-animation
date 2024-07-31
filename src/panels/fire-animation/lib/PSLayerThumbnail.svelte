<script lang="ts">
    import { FireLayerTrimmedImageData } from '../../../api/photoshop/layer'

    export let data: FireLayerTrimmedImageData | undefined
    export let width: number
    export let height: number

    let x: number
    let y: number
    let imgWidth: number
    let imgHeight: number

    $: {
        if (!data || !data.fullWidth || !data.fullHeight) {
            x = 0
            y = 0
            imgWidth = 0
            imgHeight = 0
            break $
        }

        const xPercent = data.x / data.fullWidth
        const yPercent = data.y / data.fullHeight
        const widthPercent = data.width / data.fullWidth
        const heightPercent = data.height / data.fullHeight
        x = Math.floor(xPercent * width)
        y = Math.floor(yPercent * height)
        imgWidth = Math.floor(widthPercent * width)
        imgHeight = Math.floor(heightPercent * height)
    }
</script>

<div
    class="ps-layer-thumbnail"
    style="max-width: {width}px; max-height: {height}px;">
    {#if data}
        <img
            src="data:image/jpeg;base64,{data.base64}"
            style="position: absolute; left: {x}px; top: {y}px; width: {imgWidth}px; height: {imgHeight}px;"
            alt="frame" />
    {/if}
</div>

<style>
    .ps-layer-thumbnail {
        position: relative;
        background-color: white;
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        overflow: hidden;
    }
</style>

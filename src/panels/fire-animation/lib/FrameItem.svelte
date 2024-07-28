<script lang="ts">
    import { lightenDarkenColor } from '../../../lib/utils'

    export let color: string
    export let image: string
    export let width: number

    let borderColor = lightenDarkenColor(color, 60)
</script>

<div
    class="timeline-frame"
    style="
        background-color: {color};
        border: 1px solid {borderColor};
        width: {width - 4}px;
        min-width: {width - 4}px;
    ">
    {#if image}
        <img class="timeline-frame-image" src={image} alt="frame" />
    {/if}
</div>

<style>
    .timeline-frame {
        margin: 2px;
        background-color: var(--frame-color);
        border-radius: 6px;
        position: relative;
    }

    .timeline-frame-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 6px;
        padding: 2px;
    }
</style>

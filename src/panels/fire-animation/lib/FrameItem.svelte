<script lang="ts">
    import { Frame, Row } from './timeline/Timeline'
    import { lightenDarkenColor } from '../../../lib/utils'

    export let row: Row
    export let frame: Frame
    export let width: number

    const defaultColor = '#262626'
    let color = row.color || defaultColor
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
    {#if row.expanded}
        <!--        <p>{frame.image}</p>-->
        <img
            class="timeline-frame-image"
            src="https://picsum.photos/200/300"
            alt="frame" />
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
        padding: 1px;
    }
</style>

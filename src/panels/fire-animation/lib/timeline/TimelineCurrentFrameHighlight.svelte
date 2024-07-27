<script lang="ts">
    import { getTimelineContext } from './Timeline'

    let { frameWidth, headIndex } = getTimelineContext()
    let offset = 0
    $: offset = $headIndex * $frameWidth
</script>

<div class="highlight" style="left: {offset}px;">
    <div class="playhead-line"></div>
    <div class="playhead-highlight" style="width: {$frameWidth};"></div>
</div>

<style>
    .highlight {
        position: absolute;
        height: 100%;
    }

    .playhead-line {
        background-color: var(--color-playhead-line);
        position: absolute;
        height: 100%;
        width: 2px;
        left: -1px;
        z-index: 2;
    }

    .playhead-highlight {
        position: absolute;
        height: 100%;

        background-color: var(--color-surface-3);
        z-index: -1;
    }
</style>

<script lang="ts">
    import Text from '../../../../lib/components/Text.svelte'
    import { getTimelineContext } from './Timeline'

    let { frameColCount, frameWidth, headIndex } = getTimelineContext()
</script>

<div class="timeline-frames-header">
    {#each Array($frameColCount) as _, i}
        <div
            class="frame-header {i === $headIndex ? 'active' : ''}"
            style="
                width: {$frameWidth}px;
                min-width: {$frameWidth}px;">
            <div class="frame-header-text">
                <Text size=".5rem">{i}</Text>
            </div>
            <div class="frame-header-line"></div>
        </div>
    {/each}
</div>

<style>
    .timeline-frames-header {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: stretch;
    }

    .frame-header {
        display: flex;
        flex-direction: column;
        background-color: var(--color-surface-2);
    }

    .active {
        background-color: var(--color-surface-4);
    }

    .frame-header-line {
        height: 100%;
        margin-top: 10px;
        width: 2px;
        background-color: var(--color-border);
    }
</style>

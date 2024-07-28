<script lang="ts">
    import IconButton from '../IconButton.svelte'
    import IconRewind from '../../../../lib/components/icons/IconRewind.svelte'
    import IconArrowLeft from '../../../../lib/components/icons/IconArrowLeft.svelte'
    import IconArrowRight from '../../../../lib/components/icons/IconArrowRight.svelte'
    import IconDuplicate from '../../../../lib/components/icons/IconDuplicate.svelte'
    import IconNewItem from '../../../../lib/components/icons/IconNewItem.svelte'
    import IconPlay from '../../../../lib/components/icons/IconPlay.svelte'
    import IconDelete from '../../../../lib/components/icons/IconDelete.svelte'
    import IconCollapseAll from '../../../../lib/components/icons/IconCollapseAll.svelte'
    import { getTimelineContext, Row } from './Timeline'
    import IconStop from '../../../../lib/components/icons/IconStop.svelte'

    export let rowUpdated = () => {}

    let { rows } = getTimelineContext()
    let playing = false

    function onCollapseAll() {
        function collapseAll(row: Row) {
            row.expanded = false
            if (row.children) row.children.forEach(collapseAll)
        }

        $rows.forEach(collapseAll)
        rowUpdated()
    }

    function onToBeginning() {
        console.log('to beginning')
    }

    function onPlayPause() {
        playing = !playing
        console.log('play')
    }

    function onPreviousFrame() {
        console.log('previous frame')
    }

    function onNextFrame() {
        console.log('next frame')
    }

    function onDuplicateFrame() {
        console.log('duplicate frame')
    }

    function onDeleteFrame() {
        console.log('delete frame')
    }

    function onNewFrame() {
        console.log('new frame')
    }
</script>

<div class="timeline-controls">
    <IconButton tooltip="Collapse all" click={onCollapseAll}>
        <IconCollapseAll />
    </IconButton>
    <IconButton
        tooltip="Go to first frame"
        click={onToBeginning}
        disabled={playing}>
        <IconRewind />
    </IconButton>
    <IconButton
        tooltip="Go to previous frame"
        click={onPreviousFrame}
        disabled={playing}>
        <IconArrowLeft />
    </IconButton>
    <IconButton tooltip="Play/Stop" click={onPlayPause}>
        {#if playing}
            <IconStop />
        {:else}
            <IconPlay />
        {/if}
    </IconButton>
    <IconButton
        tooltip="Go to next frame"
        click={onNextFrame}
        disabled={playing}>
        <IconArrowRight />
    </IconButton>
    <IconButton tooltip="New frame" click={onNewFrame} disabled={playing}>
        <IconNewItem />
    </IconButton>
    <IconButton
        tooltip="Duplicate frame"
        click={onDuplicateFrame}
        disabled={playing}>
        <IconDuplicate />
    </IconButton>
    <IconButton tooltip="Delete frame" click={onDeleteFrame} disabled={playing}>
        <IconDelete />
    </IconButton>
</div>

<style>
    .timeline-controls {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: var(--color-surface-1);
    }

    :global(.timeline-controls svg) {
        width: 15px;
        height: 15px;
    }
</style>

<script lang="ts">
    import IconButton from '../IconButton.svelte'
    import IconRewind from '../../../../lib/components/icons/IconRewind.svelte'
    import IconArrowLeft from '../../../../lib/components/icons/IconArrowLeft.svelte'
    import IconArrowRight from '../../../../lib/components/icons/IconArrowRight.svelte'
    import IconDuplicate from '../../../../lib/components/icons/IconDuplicate.svelte'
    import IconDelete from '../../../../lib/components/icons/IconDelete.svelte'
    import IconCollapseAll from '../../../../lib/components/icons/IconCollapseAll.svelte'
    import { getTimelineContext, Row } from './Timeline'
    import IconAdd from '../../../../lib/components/icons/IconAdd.svelte'

    let { rows } = getTimelineContext()

    function onCollapseAll() {
        function collapseAll(row: Row) {
            row.expanded.set(false)
            if (row.children) row.children.forEach(collapseAll)
        }

        $rows.forEach(collapseAll)
    }

    function onToBeginning() {
        console.log('to beginning')
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
    <IconButton tooltip="Go to first frame" click={onToBeginning}>
        <IconRewind />
    </IconButton>
    <IconButton tooltip="Go to previous frame" click={onPreviousFrame}>
        <IconArrowLeft />
    </IconButton>
    <IconButton tooltip="Go to next frame" click={onNextFrame}>
        <IconArrowRight />
    </IconButton>
    <IconButton tooltip="New frame" click={onNewFrame}>
        <IconAdd />
    </IconButton>
    <IconButton tooltip="Duplicate frame" click={onDuplicateFrame}>
        <IconDuplicate />
    </IconButton>
    <IconButton tooltip="Delete frame" click={onDeleteFrame}>
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

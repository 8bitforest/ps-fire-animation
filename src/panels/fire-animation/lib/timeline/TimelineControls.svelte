<script lang="ts">
    import IconButton from '../IconButton.svelte'
    import IconRewind from '../../../../lib/components/icons/IconRewind.svelte'
    import IconArrowLeft from '../../../../lib/components/icons/IconArrowLeft.svelte'
    import IconArrowRight from '../../../../lib/components/icons/IconArrowRight.svelte'
    import IconDuplicate from '../../../../lib/components/icons/IconDuplicate.svelte'
    import IconCollapseAll from '../../../../lib/components/icons/IconCollapseAll.svelte'
    import { findFrame, getTimelineContext, Row } from './Timeline'
    import IconAdd from '../../../../lib/components/icons/IconAdd.svelte'
    import { get } from 'svelte/store'
    import IconPreset from '../../../../lib/components/icons/IconPreset.svelte'
    import IconPageGear from '../../../../lib/components/icons/IconPageGear.svelte'
    import { Timeline } from '../../../../api/photoshop/timeline'

    let {
        rows,
        selectFrame,
        nextFrame,
        previousFrame,
        createEmptyFrame,
        createDuplicateFrame
    } = getTimelineContext()

    function onCollapseAll() {
        function collapseAll(row: Row) {
            row.expanded.set(false)
            if (row.children) row.children.forEach(collapseAll)
        }

        $rows.forEach(collapseAll)
    }

    function onToBeginning() {
        const selectedFrame = findFrame($rows, frame => get(frame.selected))
        const frame = selectedFrame?.row.frames![0]
        if (frame) selectFrame(frame)
    }

    function onPreviousFrame() {
        previousFrame()
    }

    function onNextFrame() {
        nextFrame()
    }

    function onNewFrame() {
        const selectedFrame = findFrame($rows, frame => get(frame.selected))
        const row = selectedFrame?.row
        if (row) {
            const index = row.frames!.indexOf(selectedFrame)
            createEmptyFrame(row, index)
        }
    }

    function onDuplicateFrame() {
        const selectedFrame = findFrame($rows, frame => get(frame.selected))
        if (selectedFrame) createDuplicateFrame(selectedFrame)
    }

    function onToggleOnionSkin() {
        Timeline.toggleOnionSkin()
    }

    function onOnionSkinSettings() {
        Timeline.openOnionSkinSettings()
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
    <IconButton tooltip="Toggle onion skin" click={onToggleOnionSkin}>
        <IconPreset />
    </IconButton>
    <IconButton tooltip="Onion skin settings" click={onOnionSkinSettings}>
        <IconPageGear />
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

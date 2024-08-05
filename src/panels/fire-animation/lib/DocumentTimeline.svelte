<script lang="ts">
    import { FireDocument } from '../../../api/photoshop/document'
    import IconImage from '../../../lib/components/icons/IconImage.svelte'
    import Timeline from './timeline/Timeline.svelte'
    import { Timeline as PSTimeline } from '../../../api/photoshop/timeline'
    import {
        findFrame,
        findFrameByLayerId,
        findFrames,
        findRows,
        Frame,
        layersToRows,
        Row,
        TimelineConfig,
        updateRowsFromLayers
    } from './timeline/Timeline'
    import { get, writable } from 'svelte/store'
    import { borderSize } from './timeline/FrameItem.svelte'

    export let document: FireDocument
    export let visible = true

    let currentTime = PSTimeline.getCurrentTime()
    const collapsedRowHeight = 20
    const canvasAspect = document.aspectRatio
    const frameWidthMin = collapsedRowHeight * canvasAspect * 2
    const frameWidthMax = 300
    const defaultFrameWidth = 100
    let scrollWidth = 0
    let frameColWidth = 0
    let scrollbar: HTMLElement

    let rows = writable(layersToRows(document.getLayers()))
    let config: TimelineConfig = {
        rows,
        frameWidth: writable(defaultFrameWidth),
        layerColWidth: writable(300),
        addFrameColWidth: writable(45),
        collapsedRowHeight: writable(20),
        expandedRowHeight: writable(
            calculateExpandedRowHeight(defaultFrameWidth)
        ),
        scrollX: writable(0),
        headIndex: writable(
            currentTime
                ? currentTime.frameRate * currentTime.seconds +
                      currentTime.frame
                : 0
        ),
        padFrameCount: writable(3),
        thumbnailResolution: writable(300),
        selectFrame,
        setRowVisibility,
        setScrollWidth: width => (scrollWidth = width),
        timelineResized(width) {
            frameColWidth = width
            ensureSelectedVisible()
        },
        createEmptyFrame,
        createDuplicateFrame,
        previousFrame,
        nextFrame
    }

    let {
        frameWidth,
        expandedRowHeight,
        thumbnailResolution,
        headIndex,
        scrollX
    } = config

    $: {
        PSTimeline.setCurrentTime($headIndex)
    }

    let ticking = false

    function onScroll(event: Event) {
        if (ticking) return
        ticking = true

        window.requestAnimationFrame(() => {
            const target = event.target as HTMLElement
            $scrollX = target.scrollLeft
            ticking = false
        })
    }

    function onZoom(event: Event) {
        const target = event.target as HTMLInputElement
        $frameWidth = +target.value
        $expandedRowHeight = calculateExpandedRowHeight($frameWidth)
    }

    function calculateExpandedRowHeight(width: number) {
        const widthWithSpacing = width - borderSize * 2
        return widthWithSpacing / canvasAspect + borderSize * 2
    }

    function selectFrame(frame: Frame) {
        frame.layer.select()
        const oldFrames = findFrames($rows, frame => get(frame.selected))
        for (const frame of oldFrames) frame.selected.set(false)
        frame.selected.set(true)
        $headIndex = frame.row.frames!.indexOf(frame)
        ensureSelectedVisible()
    }

    function setRowVisibility(row: Row, visible: boolean) {
        row.layer.visible = visible
        row.visible.set(visible)
    }

    function ensureSelectedVisible() {
        const selectedFrame = findFrame($rows, frame => get(frame.selected))
        if (!selectedFrame) return

        const minPadding = $frameWidth * 1.1
        const frameIndex = selectedFrame.row.frames!.indexOf(selectedFrame)
        const frameX = frameIndex * $frameWidth + $frameWidth / 2
        const minX = frameX - frameColWidth / 2 + $frameWidth / 2 + minPadding
        const maxX = frameX + frameColWidth / 2 - $frameWidth / 2 - minPadding
        const currentX = $scrollX + frameColWidth / 2
        const newX = Math.min(maxX, Math.max(minX, currentX))
        if (newX !== currentX) scrollbar.scrollLeft = newX - frameColWidth / 2
    }

    async function createEmptyFrame(row: Row, afterIndex: number) {
        await row.frames![afterIndex].layer.select()
        await document.createFrame()
        headIndex.set(afterIndex + 1)
        refreshRows()
        refreshSelectedFrames()
    }

    async function createDuplicateFrame(frame: Frame) {
        await document.duplicateLayer(frame.layer)
        headIndex.set(frame.row.frames!.indexOf(frame) + 1)
        refreshRows()
        refreshSelectedFrames()
    }

    export async function refreshCurrentFrame() {
        const frame = findFrameByLayerId($rows, document.currentLayer.id)
        if (frame?.row && get(frame.row.expanded)) {
            frame.image.set(
                await frame.layer.getBase64ImageData(
                    $thumbnailResolution,
                    $thumbnailResolution
                )
            )
        }
    }

    export function refreshRows() {
        updateRowsFromLayers($rows, document.getLayers())
        rows.set($rows)
    }

    export function refreshSelectedFrames() {
        const selectedLayers = document.getSelectedLayers()
        const selectedLayerIds = selectedLayers.map(layer => layer.id)
        const oldFrames = findFrames($rows, frame => get(frame.selected))
        for (const frame of oldFrames) frame.selected.set(false)

        const newFrames = findFrames($rows, frame =>
            selectedLayerIds.includes(frame.layer.id)
        )
        for (const frame of newFrames) frame.selected.set(true)
    }

    export function layerVisibilityChanged(layerName: string) {
        const updatedRows = findRows($rows, row => row.name === layerName)
        for (const row of updatedRows) row.visible.set(row.layer.visible)
    }

    export function timelineTimeChanged(frame: number) {
        $headIndex = frame
    }

    export function nextFrame() {
        const selectedFrame = findFrame($rows, frame => get(frame.selected))
        if (!selectedFrame) return
        const index = selectedFrame.row.frames!.indexOf(selectedFrame)
        if (index < selectedFrame.row.frames!.length - 1)
            selectFrame(selectedFrame.row.frames![index + 1])
    }

    export function previousFrame() {
        const selectedFrame = findFrame($rows, frame => get(frame.selected))
        if (!selectedFrame) return
        const index = selectedFrame.row.frames!.indexOf(selectedFrame)
        if (index && index > 0)
            selectFrame(selectedFrame.row.frames![index - 1])
    }
</script>

<div class="timeline-container" style="display: {visible ? 'flex' : 'none'}">
    <div class="timeline">
        <Timeline {config} />
    </div>
    <div class="footer">
        <IconImage class="zoom-icon-small" />
        <input
            type="range"
            min={frameWidthMin}
            max={frameWidthMax}
            value={defaultFrameWidth}
            on:input={onZoom} />
        <IconImage class="zoom-icon-large" />
        <div class="scroll-bar-container">
            <div class="scroll-bar" on:scroll={onScroll} bind:this={scrollbar}>
                <div class="scroll-bar-inner" style="min-width: {scrollWidth}">
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .timeline-container {
        flex-direction: column;
        height: 100%;
        width: 100%;
    }

    .timeline {
        flex-grow: 1;
        height: 0;
    }

    .footer {
        flex-shrink: 0;
        padding-left: 16px;
        margin-right: 16px;
        background-color: var(--color-surface-1);
        border-top: 1px solid var(--color-border);
        height: 20px;
        display: flex;
        align-items: center;
        flex-direction: row;
    }

    :global(.zoom-icon-small) {
        height: 75%;
        margin-right: -6px;
    }

    :global(.zoom-icon-large) {
        height: 100%;
        margin-left: -6px;
        margin-right: 16px;
    }

    .scroll-bar-container {
        height: 100%;
        width: 100%;
        background-color: var(--color-scrollbar);
    }

    .scroll-bar {
        overflow-x: scroll;
        height: 100%;
        position: relative;
        top: -3px;
    }

    .scroll-bar-inner {
        height: 0;
    }
</style>

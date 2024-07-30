<script lang="ts">
    import Timeline from './lib/timeline/Timeline.svelte'
    import {
        findFrameByLayerId,
        findFrames,
        Frame,
        layersToRows,
        TimelineConfig
    } from './lib/timeline/Timeline'
    import Toolbar from './lib/Toolbar.svelte'
    import { get, writable } from 'svelte/store'
    import IconImage from '../../lib/components/icons/IconImage.svelte'
    import { FireDocument } from '../../api/photoshop/document'
    import { FireListeners } from '../../api/photoshop/listeners'
    import { Timeline as PSTimeline } from '../../api/photoshop/timeline'

    let document = FireDocument.current
    const collapsedRowHeight = 20
    const canvasAspect = document.aspectRatio
    const frameWidthMin = collapsedRowHeight * canvasAspect * 2
    const frameWidthMax = 300
    const defaultFrameWidth = 100
    let scrollWidth = 0

    let currentTime = PSTimeline.getCurrentTime()

    let config: TimelineConfig = {
        rows: writable(layersToRows(document.getLayers())),
        frameWidth: writable(defaultFrameWidth),
        layerColWidth: writable(300),
        addFrameColWidth: writable(50),
        collapsedRowHeight: writable(20),
        expandedRowHeight: writable(defaultFrameWidth / canvasAspect),
        scrollPercentage: writable(0),
        headIndex: writable(
            currentTime.frameRate * currentTime.seconds + currentTime.frame
        ),
        padFrameCount: writable(3),
        thumbnailResolution: writable(300),
        selectFrame,
        setScrollWidth: width => (scrollWidth = width)
    }

    let {
        rows,
        scrollPercentage,
        frameWidth,
        expandedRowHeight,
        thumbnailResolution,
        headIndex
    } = config

    let ticking = false

    function onScroll(event: Event) {
        if (ticking) return
        ticking = true

        window.requestAnimationFrame(() => {
            const target = event.target as HTMLElement
            const width = target.scrollWidth - target.clientWidth
            let percent = target.scrollLeft / (width - 10)
            $scrollPercentage = Math.min(1, Math.max(0, percent))
            ticking = false
        })
    }

    function onZoom(event: Event) {
        const target = event.target as HTMLInputElement
        $frameWidth = +target.value
        $expandedRowHeight = $frameWidth / canvasAspect
        config = config
    }

    function selectFrame(frame: Frame) {
        frame.layer.select()
        const oldFrames = findFrames($rows, frame => get(frame.selected))
        for (const frame of oldFrames) frame.selected.set(false)
        frame.selected.set(true)
        $headIndex = frame.row.frames!.indexOf(frame)
    }

    $: {
        PSTimeline.setCurrentTime($headIndex)
    }

    FireListeners.addHistoryStateListener(async () => {
        await refreshCurrentFrame()
    })

    FireListeners.addLayerSelectListener(async layerIds => {
        const oldFrames = findFrames($rows, frame => get(frame.selected))
        for (const frame of oldFrames) frame.selected.set(false)

        const newFrames = findFrames($rows, frame =>
            layerIds.includes(frame.layer.id)
        )
        for (const frame of newFrames) frame.selected.set(true)
    })

    FireListeners.addTimelineTimeChangeListener(async time => {
        $headIndex = time
    })

    async function refreshCurrentFrame() {
        const frame = findFrameByLayerId($rows, document.currentLayer.id)
        if (frame?.row?.expanded) {
            frame.image.set(
                await frame.layer.getBase64ImageData(
                    $thumbnailResolution,
                    $thumbnailResolution
                )
            )
        }
    }
</script>

<div class="fire-animation">
    <div class="toolbar">
        <Toolbar />
    </div>
    <div class="timeline">
        <Timeline {config} />
    </div>
    <div class="footer">
        <IconImage class="zoom-icon-small" />
        <input
            type="range"
            min={frameWidthMin}
            max={frameWidthMax}
            value={config.frameWidth}
            on:input={onZoom} />
        <IconImage class="zoom-icon-large" />
        <div class="scroll-bar-container">
            <div class="scroll-bar" on:scroll={onScroll}>
                <div class="scroll-bar-inner" style="min-width: {scrollWidth}">
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .fire-animation {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        background-color: var(--color-surface-3);
    }

    .toolbar {
        height: 30px;
        flex-shrink: 0;
        margin-bottom: 15px;
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
        margin-right: -10px;
    }

    :global(.zoom-icon-large) {
        height: 100%;
        margin-left: -10px;
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

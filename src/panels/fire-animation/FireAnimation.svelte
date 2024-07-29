<script lang="ts">
    import Timeline from './lib/timeline/Timeline.svelte'
    import {
        findFrame,
        layersToRows,
        TimelineConfig
    } from './lib/timeline/Timeline'
    import Toolbar from './lib/Toolbar.svelte'
    import { writable } from 'svelte/store'
    import IconImage from '../../lib/components/icons/IconImage.svelte'
    import { FireDocument } from '../../api/photoshop/document'
    import { FireListeners } from '../../api/photoshop/listeners'

    let document = FireDocument.current
    const collapsedRowHeight = 20
    const canvasAspect = document.aspectRatio
    const frameWidthMin = collapsedRowHeight * canvasAspect
    const frameWidthMax = 300
    const defaultFrameWidth = 100
    let scrollWidth = 0

    let config: TimelineConfig = {
        rows: layersToRows(document.getLayers()),
        frameWidth: defaultFrameWidth,
        layerColWidth: 300,
        addFrameColWidth: 50,
        collapsedRowHeight: 20,
        expandedRowHeight: defaultFrameWidth / canvasAspect,
        headIndex: 10,
        padFrameCount: 3,
        thumbnailResolution: 300
    }

    let scrollPercentage = writable(0)

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
        config.frameWidth = +target.value
        config.expandedRowHeight = config.frameWidth / canvasAspect
        config = config
    }

    FireListeners.addHistoryStateListener(async () => {
        console.log('History state changed, refreshing current frame')
        await refreshCurrentFrame()
    })

    async function refreshCurrentFrame() {
        const frame = findFrame(config.rows, document.currentLayer.id)
        if (frame?.row?.expanded) {
            frame.image.set(
                await frame.layer.getBase64ImageData(
                    config.thumbnailResolution,
                    config.thumbnailResolution
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
        <Timeline
            {config}
            {scrollPercentage}
            setScrollWidth={value => (scrollWidth = value)} />
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

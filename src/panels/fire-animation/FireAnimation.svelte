<script lang="ts">
    import Timeline from './lib/timeline/Timeline.svelte'
    import type { Row, TimelineConfig } from './lib/timeline/Timeline'
    import Toolbar from './lib/Toolbar.svelte'
    import { writable } from 'svelte/store'
    import Text from '../../lib/components/Text.svelte'
    import IconImage from '../../lib/components/icons/IconImage.svelte'

    const purple = '#5d4682'
    const red = '#bf2608'
    const blue = '#0b5a7d'
    const green = '#0b7d5a'

    const anims = ['Walk', 'Run', 'Jump', 'Idle', 'Attack', 'Die']
    let frameId = 1
    let rows: Row[] = anims.map(name => ({
        name,
        expanded: true,
        children: [
            {
                name: 'Normals',
                color: purple,
                frames: Array.from({ length: 5 }, () => ({
                    id: frameId,
                    layerId: frameId++,
                    image: 'https://picsum.photos/200/300'
                })),
                expanded: true
            },
            {
                name: 'Colors',
                expanded: true,
                children: [
                    {
                        name: 'Stroke',
                        color: blue,
                        frames: Array.from({ length: 3 }, () => ({
                            id: frameId,
                            layerId: frameId++,
                            image: 'https://picsum.photos/200/300'
                        })),
                        expanded: true
                    },
                    {
                        name: 'Texture',
                        color: red,
                        frames: Array.from({ length: 4 }, () => ({
                            id: frameId,
                            layerId: frameId++,
                            image: 'https://picsum.photos/200/300'
                        })),
                        expanded: true
                    },
                    {
                        name: 'Fill',
                        color: green,
                        frames: Array.from({ length: 50 }, () => ({
                            id: frameId,
                            layerId: frameId++,
                            image: 'https://picsum.photos/200/300'
                        })),
                        expanded: true
                    }
                ]
            }
        ]
    }))

    const collapsedRowHeight = 20
    const canvasAspect = 1
    const frameWidthMin = collapsedRowHeight * canvasAspect
    const frameWidthMax = 300
    const defaultFrameWidth = 100
    let scrollWidth = 0

    let config: TimelineConfig = {
        rows,
        frameWidth: defaultFrameWidth,
        layerColWidth: 300,
        addFrameColWidth: 50,
        collapsedRowHeight: 20,
        expandedRowHeight: defaultFrameWidth / canvasAspect,
        headIndex: 10,
        padFrameCount: 3
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

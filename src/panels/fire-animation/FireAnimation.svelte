<script lang="ts">
    import Timeline from './lib/Timeline.svelte'
    import type { Row } from './lib/Timeline'
    import Toolbar from './lib/Toolbar.svelte'

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
                    layerId: frameId++
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
                            layerId: frameId++
                        })),
                        expanded: true
                    },
                    {
                        name: 'Texture',
                        color: red,
                        frames: Array.from({ length: 4 }, () => ({
                            id: frameId,
                            layerId: frameId++
                        })),
                        expanded: true
                    },
                    {
                        name: 'Fill',
                        color: green,
                        frames: Array.from({ length: 16 }, () => ({
                            id: frameId,
                            layerId: frameId++
                        })),
                        expanded: true
                    }
                ]
            }
        ]
    }))

    const layerWidth = 300
    const frameWidth = 100
    const extraFramesPadding = 3
    const maxFrameCount = getMaxFrameCount(rows) + extraFramesPadding
    const frameRowWidth = maxFrameCount * frameWidth
    let scrollPercentage = 0

    function getMaxFrameCount(rows: Row[]): number {
        return rows.reduce((max, row) => {
            const count = row.children
                ? getMaxFrameCount(row.children)
                : row.frames.length
            return Math.max(max, count)
        }, 0)
    }

    let ticking = false
    function onScroll(event: Event) {
        if (ticking) return
        ticking = true

        window.requestAnimationFrame(() => {
            const target = event.target as HTMLElement
            const width = target.scrollWidth - target.clientWidth
            let percent = target.scrollLeft / (width - 10)
            scrollPercentage = Math.min(1, Math.max(0, percent))
            ticking = false
        })
    }
</script>

<div class="fire-animation">
    <div class="toolbar">
        <Toolbar />
    </div>
    <div class="timeline">
        <Timeline
            {layerWidth}
            {rows}
            {frameWidth}
            {frameRowWidth}
            {scrollPercentage} />
    </div>
    <div class="footer">
        <div class="scroll-bar" on:scroll={onScroll}>
            <div
                class="scroll-bar-inner"
                style="min-width: {frameRowWidth + layerWidth}">
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
        margin-top: 15px;
        margin-right: 15px;
        background-color: var(--color-surface-4);

        display: flex;
        align-items: center;
        flex-direction: row;
    }

    .scroll-bar {
        overflow-x: scroll;
    }

    .scroll-bar-inner {
        height: 0;
        background-color: var(--color-surface-4);
    }
</style>

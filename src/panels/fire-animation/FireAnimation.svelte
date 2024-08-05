<script lang="ts">
    import Toolbar from './lib/Toolbar.svelte'
    import { FireDocument } from '../../api/photoshop/document'
    import { FireListeners } from '../../api/photoshop/listeners'
    import DocumentTimeline from './lib/DocumentTimeline.svelte'
    import { onMount } from 'svelte'
    import { Timeline } from '../../api/photoshop/timeline'
    import Text from '../../lib/components/Text.svelte'
    import { entrypoints } from 'uxp'

    let container: HTMLElement
    const documentTimelines = new Map<number, DocumentTimeline>()
    let currentDocumentTimeline: DocumentTimeline | undefined

    onMount(() => {
        getOrCreateDocumentTimeline(FireDocument.current.id)
        switchToCurrentDocumentTimeline()
    })

    function getOrCreateDocumentTimeline(documentId: number) {
        if (documentTimelines.has(documentId))
            return documentTimelines.get(documentId)

        const documentTimeline = new DocumentTimeline({
            target: container,
            props: {
                document: FireDocument.fromId(documentId)
            }
        })
        documentTimelines.set(documentId, documentTimeline)
        return documentTimeline
    }

    function switchToCurrentDocumentTimeline() {
        const id = FireDocument.current.id
        const timelineEnabled = Timeline.enabled
        if (!timelineEnabled) {
            currentDocumentTimeline = undefined
            for (const [, documentTimeline] of documentTimelines)
                documentTimeline.$set({ visible: false })
            return
        }

        currentDocumentTimeline = getOrCreateDocumentTimeline(id)
        for (const [documentId, documentTimeline] of documentTimelines) {
            documentTimeline.$set({ visible: documentId === id })
        }
    }

    FireListeners.addNewDocumentListener(async () => {
        switchToCurrentDocumentTimeline()
    })

    FireListeners.addSelectDocumentListener(async () => {
        switchToCurrentDocumentTimeline()
    })

    FireListeners.addCloseDocumentListener(async documentId => {
        const documentTimeline = documentTimelines.get(documentId)
        if (documentTimeline) {
            documentTimeline.$destroy()
            documentTimelines.delete(documentId)
        }
        switchToCurrentDocumentTimeline()
    })

    FireListeners.addHistoryStateListener(async () => {
        await fullRefresh()
    })

    let refreshing = false
    let needsRefresh = false

    async function fullRefresh() {
        if (refreshing) {
            needsRefresh = true
            return
        }

        refreshing = true
        const startTime = performance.now()

        const documentId = FireDocument.current.id
        const timelineEnabled = Timeline.enabled
        const existingTimeline = documentTimelines.get(documentId)
        if (!timelineEnabled && existingTimeline) {
            existingTimeline.$destroy()
            documentTimelines.delete(documentId)
        }
        switchToCurrentDocumentTimeline()

        currentDocumentTimeline?.refreshRows()
        await currentDocumentTimeline?.refreshCurrentFrame()
        currentDocumentTimeline?.refreshSelectedFrames()

        console.log(
            'History state update took',
            performance.now() - startTime,
            'ms'
        )

        refreshing = false
        if (needsRefresh) {
            needsRefresh = false
            await fullRefresh()
        }
    }

    FireListeners.addLayerSelectListener(async () => {
        currentDocumentTimeline?.refreshSelectedFrames()
    })

    FireListeners.addTimelineTimeChangeListener(async time => {
        currentDocumentTimeline?.timelineTimeChanged(time)
    })

    FireListeners.addLayerVisibilityChangeListener(async layerName => {
        currentDocumentTimeline?.layerVisibilityChanged(layerName)
    })

    const commands = {
        previousFrame: async () => {
            currentDocumentTimeline?.previousFrame()
        },
        nextFrame: async () => {
            currentDocumentTimeline?.nextFrame()
        }
    }

    // @ts-ignore
    entrypoints.setup({ commands })
    Object.assign(window, commands)
</script>

<div class="fire-animation" bind:this={container}>
    <div class="toolbar">
        <Toolbar />
    </div>
    {#if !currentDocumentTimeline}
        <div class="timeline-error">
            <Text
                >To use Fire Animation, create a video timeline (<b>not</b> frame
                animation) for this document.
            </Text>
        </div>
    {/if}
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

    .timeline-error {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-grow: 1;
        padding: 25px;
        text-align: center;
    }
</style>

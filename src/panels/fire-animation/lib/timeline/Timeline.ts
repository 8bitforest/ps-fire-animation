import { Readable, writable, Writable } from 'svelte/store'
import { getContext } from 'svelte'
import {
    FireLayer,
    FireLayerTrimmedImageData,
    FireLayerType,
    layerColors
} from '../../../../api/photoshop/layer'

export interface RowBase {
    id: number
    name: string
    color: string
    layer: FireLayer
    expanded: Writable<boolean>
    visible: Writable<boolean>
}

export interface FolderRow extends RowBase {
    children: Row[]
    frames?: never
}

export interface FrameRow extends RowBase {
    frames: Frame[]
    children?: never
}

export type Row = FolderRow | FrameRow

export interface Frame {
    id: number
    name: string
    layer: FireLayer
    row: Row
    image: Writable<FireLayerTrimmedImageData | null>
    selected: Writable<boolean>
}

export interface TimelineConfig {
    rows: Readable<Row[]>
    frameWidth: Readable<number>
    layerColWidth: Readable<number>
    addFrameColWidth: Readable<number>
    collapsedRowHeight: Readable<number>
    expandedRowHeight: Readable<number>
    scrollX: Writable<number>
    headIndex: Writable<number>
    padFrameCount: Readable<number>
    thumbnailResolution: Readable<number>

    selectFrame: (frame: Frame) => void
    setRowVisibility: (row: Row, visible: boolean) => void
    setScrollWidth: (width: number) => void
    timelineResized: (frameColWidth: number) => void
    createEmptyFrame: (row: Row, index: number) => void
    createDuplicateFrame: (frame: Frame) => void
    previousFrame: () => void
    nextFrame: () => void
}

export interface TimelineContext extends TimelineConfig {
    scrollOffset: Readable<number>
    frameColCount: Readable<number>
}

export const timelineContextKey = 'timeline'

export function getTimelineContext(): TimelineContext {
    return getContext(timelineContextKey)
}

export function getMaxFrameCount(rows: Row[]): number {
    return rows.reduce((max, row) => {
        const count = row.children
            ? getMaxFrameCount(row.children)
            : row.frames.length
        return Math.max(max, count)
    }, 0)
}

export function getRowHeight(
    row: Row,
    expanded: boolean,
    collapsedHeight: number,
    expandedHeight: number
): number {
    return !row.children && expanded ? expandedHeight : collapsedHeight
}

export function getRowHeightStyle(
    row: Row,
    expanded: boolean,
    collapsedHeight: number,
    expandedHeight: number
): string {
    const height = getRowHeight(row, expanded, collapsedHeight, expandedHeight)
    return `min-height: ${height}px; max-height: ${height}px; height: ${height}px;`
}

function makeRow(layer: FireLayer): Row {
    if (layer.type === FireLayerType.Video) {
        let frames = [...layer.children]
        frames.reverse()

        const row: Row = {
            id: layer.id,
            name: layer.name,
            color:
                layer.color === layerColors.none
                    ? layerColors.violet.hex
                    : layer.color.hex,
            layer,
            expanded: writable(false),
            visible: writable(layer.visible),
            frames: []
        }

        row.frames = frames.map(frame => makeFrame(row, frame))
        return row
    } else if (layer.type === FireLayerType.Group) {
        return {
            id: layer.id,
            name: layer.name,
            color: layer.color === layerColors.none ? '' : layer.color.hex,
            layer,
            expanded: writable(layer.expanded),
            visible: writable(layer.visible),
            children: layer.children.map(makeRow)
        }
    } else {
        const row: FrameRow = {
            id: layer.id,
            name: layer.name,
            color:
                layer.color === layerColors.none
                    ? layerColors.violet.hex
                    : layer.color.hex,
            layer,
            expanded: writable(false),
            visible: writable(layer.visible),
            frames: []
        }

        row.frames = [makeFrame(row, layer)]
        return row
    }
}

function makeFrame(parent: Row, layer: FireLayer): Frame {
    return {
        id: layer.id,
        name: layer.name,
        layer,
        row: parent,
        image: writable(null),
        selected: writable(layer.selected)
    }
}

export function layersToRows(layers: FireLayer[]): Row[] {
    const rows = []
    for (const layer of layers) rows.push(makeRow(layer))
    return rows
}

export function updateRowsFromLayers(rows: Row[], layers: FireLayer[]) {
    function updateRows(rows: Row[], layers: ReadonlyArray<FireLayer>) {
        const newRows = []
        for (const layer of layers) {
            let row = rows.find(row => row.id === layer.id)
            if (row) {
                const type = row.layer.type
                if (type === FireLayerType.Group && row.children)
                    updateRows(row.children, layer.children)
                else if (type === FireLayerType.Group && !row.children)
                    row = {
                        ...row,
                        children: layer.children.map(makeRow),
                        frames: undefined
                    }
                else if (type === FireLayerType.Video && row.frames)
                    updateFrames(row, row.frames, layer.children)
                else if (type === FireLayerType.Video && !row.frames) {
                    row = { ...row, frames: [], children: undefined }
                    row.frames = layer.children.map(frame =>
                        makeFrame(row!, frame)
                    )
                }

                row.color =
                    layer.color === layerColors.none ? '' : layer.color.hex
            } else {
                row = makeRow(layer)
            }

            newRows.push(row)
        }
        rows.length = newRows.length
        rows.splice(0, newRows.length, ...newRows)
    }

    function updateFrames(
        parent: Row,
        frames: Frame[],
        layers: ReadonlyArray<FireLayer>
    ) {
        const newFrames = []
        let reversed = [...layers]
        reversed.reverse()
        for (const layer of reversed) {
            const frame = frames.find(frame => frame.id === layer.id)
            if (frame) newFrames.push(frame)
            else newFrames.push(makeFrame(parent, layer))
        }
        frames.length = newFrames.length
        frames.splice(0, newFrames.length, ...newFrames)
    }

    updateRows(rows, layers)
}

export function findRow(rows: Row[], layerId: number): Row | undefined {
    for (const row of rows) {
        if (row.layer.id === layerId) return row
        if (row.children) {
            const found = findRow(row.children, layerId)
            if (found) return found
        }
    }
}

export function findRows(rows: Row[], predicate: (row: Row) => boolean): Row[] {
    const found: Row[] = []

    for (const row of rows) {
        if (predicate(row)) found.push(row)
        if (row.children) found.push(...findRows(row.children, predicate))
    }

    return found
}

export function findFrameByLayerId(
    rows: Row[],
    layerId: number
): Frame | undefined {
    return findFrame(rows, frame => frame.layer.id === layerId)
}

export function findFrame(
    rows: Row[],
    predicate: (frame: Frame) => boolean
): Frame | undefined {
    for (const row of rows) {
        if (row.children) {
            const found = findFrame(row.children, predicate)
            if (found) return found
        } else {
            for (const frame of row.frames) {
                if (predicate(frame)) return frame
            }
        }
    }
}

export function findFrames(
    rows: Row[],
    predicate: (frame: Frame) => boolean
): Frame[] {
    const frames: Frame[] = []

    for (const row of rows) {
        if (row.children) {
            frames.push(...findFrames(row.children, predicate))
        } else {
            for (const frame of row.frames) {
                if (predicate(frame)) frames.push(frame)
            }
        }
    }

    return frames
}

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
    expanded: boolean
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
}

export interface TimelineConfig {
    rows: Row[]
    frameWidth: number
    layerColWidth: number
    addFrameColWidth: number
    collapsedRowHeight: number
    expandedRowHeight: number
    headIndex: number
    padFrameCount: number
    thumbnailResolution: number
}

export interface TimelineContext {
    rows: Readable<Row[]>
    frameWidth: Readable<number>
    layerColWidth: Readable<number>
    addFrameColWidth: Readable<number>
    collapsedRowHeight: Readable<number>
    expandedRowHeight: Readable<number>
    scrollPercentage: Readable<number>
    scrollOffset: Readable<number>
    frameColCount: Readable<number>
    headIndex: Readable<number>
    thumbnailResolution: Readable<number>
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
    collapsed: number,
    expanded: number
): number {
    return !row.children && row.expanded ? expanded : collapsed
}

export function getRowHeightStyle(
    row: Row,
    collapsed: number,
    expanded: number
): string {
    const height = getRowHeight(row, collapsed, expanded)
    return `min-height: ${height}px; max-height: ${height}px; height: ${height}px;`
}

export function layersToRows(layers: FireLayer[]): Row[] {
    const rows = []

    function makeRow(layer: FireLayer): Row {
        if (layer.type === FireLayerType.Video) {
            let frames = [...layer.children]
            frames.reverse()

            const row: FrameRow = {
                id: layer.id,
                name: layer.name,
                color:
                    layer.color === layerColors.none
                        ? layerColors.violet.hex
                        : layer.color.hex,
                layer,
                expanded: layer.expanded,
                frames: []
            }

            row.frames = frames.map(child => {
                return {
                    id: child.id,
                    name: child.name,
                    layer: child,
                    row,
                    image: writable(null)
                }
            })

            return row
        } else if (layer.type === FireLayerType.Group) {
            return {
                id: layer.id,
                name: layer.name,
                color: layer.color === layerColors.none ? '' : layer.color.hex,
                layer,
                expanded: layer.expanded,
                children: layer.children.map(makeRow)
            }
        } else {
            const row: FrameRow = {
                id: layer.id,
                name: layer.name,
                color: layer.color.hex,
                layer,
                expanded: false,
                frames: []
            }

            row.frames = [
                {
                    id: layer.id,
                    name: layer.name,
                    layer,
                    row,
                    image: writable(null)
                }
            ]

            return row
        }
    }

    for (const layer of layers) rows.push(makeRow(layer))

    return rows
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

export function findFrame(rows: Row[], layerId: number): Frame | undefined {
    for (const row of rows) {
        if (row.children) {
            const found = findFrame(row.children, layerId)
            if (found) return found
        } else {
            for (const frame of row.frames) {
                if (frame.id === layerId) return frame
            }
        }
    }
}

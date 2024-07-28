import { Readable } from 'svelte/store'
import { getContext } from 'svelte'

export interface RowBase {
    name: string
    expanded: boolean
}

export interface FolderRow extends RowBase {
    children: Row[]
    folderId?: number
    frames?: never
    color?: never
}

export interface FrameRow extends RowBase {
    color?: string
    frames: Frame[]
    children?: never
    folderId?: never
}

export type Row = FolderRow | FrameRow

export interface Frame {
    id: number
    layerId: number
    image: string
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

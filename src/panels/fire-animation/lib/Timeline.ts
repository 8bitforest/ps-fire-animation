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
}
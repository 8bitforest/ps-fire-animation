import ps from 'photoshop'
import { Layer } from 'photoshop/dom/Layer'
import { ActionTarget } from './action'

export enum FireLayerType {
    Group = 'group',
    Layer = 'layer',
    Video = 'video',
    Unknown = 'unknown'
}

export interface FireLayerColor {
    value: string
    name: string
    hex: string
}

export interface FireLayerTrimmedImageData {
    base64: string
    x: number
    y: number
    width: number
    height: number
    fullWidth: number
    fullHeight: number
}

export const layerColors = {
    none: { value: 'none', name: 'None', hex: 'transparent' },
    red: { value: 'red', name: 'Red', hex: '#8d2d2c' },
    orange: { value: 'orange', name: 'Orange', hex: '#935201' },
    yellowColor: { value: 'yellowColor', name: 'Yellow', hex: '#957c00' },
    grain: { value: 'grain', name: 'Green', hex: '#3f6334' },
    seafoam: { value: 'seafoam', name: 'Seafoam', hex: '#006662' },
    blue: { value: 'blue', name: 'Blue', hex: '#3e4f85' },
    indigo: { value: 'indigo', name: 'Indigo', hex: '#3236a7' },
    magenta: { value: 'magenta', name: 'Magenta', hex: '#a92f64' },
    fuchsia: { value: 'fuchsia', name: 'Fuchsia', hex: '#852487' },
    violet: { value: 'violet', name: 'Violet', hex: '#5d4681' },
    gray: { value: 'gray', name: 'Gray', hex: '#535353' }
}

export class FireLayer {
    private _target: ActionTarget

    constructor(public readonly psLayer: Layer) {
        this._target = ActionTarget.fromLayer(psLayer.id)
    }

    get id() {
        return this.psLayer.id
    }

    get name() {
        return this.psLayer.name
    }

    get selected() {
        return this.psLayer.selected
    }

    async select() {
        await ps.core.executeAsModal(
            async () => {
                await ps.action.batchPlay(
                    [
                        {
                            _obj: 'select',
                            _target: [
                                {
                                    _ref: 'layer',
                                    _id: this.psLayer.id
                                }
                            ],
                            layerID: [this.psLayer.id]
                        }
                    ],
                    {}
                )
            },
            { commandName: 'selectLayer' }
        )
    }

    get visible() {
        return this.psLayer.visible
    }

    set visible(value: boolean) {
        ps.core.executeAsModal(
            async () => {
                this.psLayer.visible = value
            },
            { commandName: 'setLayerVisibility' }
        )
    }

    get type() {
        // Photoshop doesn't tell you if a group is a video group...
        // So just assume any group with *only* normal layers is a video group
        if (this.psLayer.kind.toString() === 'pixel') {
            return FireLayerType.Layer
        } else if (this.psLayer.kind.toString() === 'group') {
            if (
                this.psLayer.layers?.every(l => l.kind.toString() === 'pixel')
            ) {
                return FireLayerType.Video
            } else {
                return FireLayerType.Group
            }
        } else {
            return FireLayerType.Unknown
        }
    }

    get color() {
        const psColor = this._target.getProperty('color')['_value']
        return (
            Object.values(layerColors).find(c => c.value === psColor) ||
            layerColors.none
        )
    }

    get expanded() {
        return !!this._target.getProperty('layerSectionExpanded')
    }

    get children(): ReadonlyArray<FireLayer> {
        return this.psLayer.layers?.map(layer => new FireLayer(layer)) ?? []
    }

    async getBase64ImageData(
        width: number,
        height: number
    ): Promise<FireLayerTrimmedImageData> {
        return ps.core.executeAsModal(
            async () => {
                const imageObj = await ps.imaging.getPixels({
                    layerID: this.psLayer.id,
                    targetSize: { width, height },
                    componentSize: 8,
                    applyAlpha: true
                })

                const base64 = (await ps.imaging.encodeImageData({
                    imageData: imageObj.imageData,
                    base64: true
                })) as string

                return {
                    base64,
                    x: imageObj.sourceBounds.left,
                    y: imageObj.sourceBounds.top,
                    width:
                        imageObj.sourceBounds.right -
                        imageObj.sourceBounds.left,
                    height:
                        imageObj.sourceBounds.bottom -
                        imageObj.sourceBounds.top,
                    fullWidth:
                        this.psLayer.document.width /
                        Math.pow(2, imageObj.level),
                    fullHeight:
                        this.psLayer.document.height /
                        Math.pow(2, imageObj.level)
                }
            },
            { commandName: 'getLayerImageData' }
        )
    }
}

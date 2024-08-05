import ps from 'photoshop'
import { Document } from 'photoshop/dom/Document'
import { FireLayer } from './layer'

export class FireDocument {
    constructor(public readonly psDocument: Document) {}

    static fromId(id: number) {
        const psDocument = ps.app.documents.filter(doc => doc.id === id)?.[0]
        if (!psDocument) throw new Error(`Document with id ${id} not found`)
        return new FireDocument(psDocument)
    }

    static get current() {
        return new FireDocument(ps.app.activeDocument)
    }

    get id() {
        return this.psDocument.id
    }

    get currentLayer() {
        return new FireLayer(ps.app.activeDocument.activeLayers[0])
    }

    getSelectedLayers() {
        return ps.app.activeDocument.activeLayers.map(
            layer => new FireLayer(layer)
        )
    }

    getLayers(): FireLayer[] {
        return this.psDocument.layers.map(layer => new FireLayer(layer))
    }

    async createFrame(using: any = {}): Promise<FireLayer> {
        await this.psDocument.suspendHistory(async () => {
            let result = await ps.action.batchPlay(
                [
                    {
                        _obj: 'make',
                        _target: [{ _ref: 'layer' }],
                        using
                    },
                    {
                        _obj: 'moveOutTime',
                        timeOffset: {
                            _obj: 'timecode',
                            frame: -9999,
                            frameRate: 0,
                            seconds: 0
                        }
                    }
                ],
                {}
            )
        }, 'Create Layer')

        return new FireLayer(this.psDocument.activeLayers[0])
    }

    async duplicateLayer(layer: FireLayer): Promise<FireLayer> {
        await this.psDocument.suspendHistory(async () => {
            let result = await ps.action.batchPlay(
                [
                    {
                        _obj: 'duplicate',
                        _target: [
                            {
                                _ref: 'layer',
                                _id: layer.id
                            }
                        ]
                    }
                ],
                {}
            )
        }, 'Duplicate Layer')

        return new FireLayer(this.psDocument.activeLayers[0])
    }

    get canvasSize() {
        return {
            width: this.psDocument.width,
            height: this.psDocument.height
        }
    }

    get aspectRatio() {
        return this.canvasSize.width / this.canvasSize.height
    }
}

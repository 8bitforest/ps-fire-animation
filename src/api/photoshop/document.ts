import ps from 'photoshop'
import { Document } from 'photoshop/dom/Document'
import { FireLayer } from './layer'

export class FireDocument {
    constructor(public readonly psDocument: Document) {}

    static get current() {
        return new FireDocument(ps.app.activeDocument)
    }

    get currentLayer() {
        return new FireLayer(ps.app.activeDocument.activeLayers[0])
    }

    getLayers(): FireLayer[] {
        return this.psDocument.layers.map(layer => new FireLayer(layer))
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

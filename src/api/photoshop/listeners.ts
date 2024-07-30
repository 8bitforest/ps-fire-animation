import ps from 'photoshop'

interface ToolModalStateChangedDescriptor {
    state: {
        _value: 'enter' | 'exit'
    }
    kind: {
        _value: 'paint'
    }
}

interface HistoryStateChangedDescriptor {
    ID: number
}

interface SelectDescriptor {
    layerID: number[]
}

interface SetTimelineTimeDescriptor {
    to: { _obj: string; seconds: number; frame: number; frameRate: number }
}

interface HideDescriptor {
    _obj: 'hide'
    null: {
        _ref: string
        _name: string
    }[]
}

interface ShowDescriptor {
    _obj: 'show'
    null: {
        _ref: string
        _name: string
    }[]
}

async function addListener<T>(
    event: string,
    callback: (descriptor: T) => void
) {
    await ps.action.addNotificationListener([event], (event, descriptor) => {
        callback(descriptor as T)
    })
}

export class FireListeners {
    static async addPaintEndListener(callback: () => void): Promise<void> {
        await addListener<ToolModalStateChangedDescriptor>(
            'toolModalStateChanged',
            descriptor => {
                if (
                    descriptor.state._value === 'exit' &&
                    descriptor.kind._value === 'paint'
                )
                    callback()
            }
        )
    }

    static async addHistoryStateListener(callback: () => void): Promise<void> {
        // For some reason photoshop sometimes sends duplicate history state change events?
        // So make sure we only call the callback once per change
        let lastId = 0
        await addListener<HistoryStateChangedDescriptor>(
            'historyStateChanged',
            descriptor => {
                if (descriptor.ID !== lastId) {
                    lastId = descriptor.ID
                    callback()
                }
            }
        )
    }

    static async addLayerSelectListener(
        callback: (layerId: number[]) => void
    ): Promise<void> {
        await addListener<SelectDescriptor>('select', descriptor => {
            console.log('select', descriptor)
            callback(descriptor.layerID)
        })
    }

    static async addTimelineTimeChangeListener(
        callback: (frame: number) => void
    ): Promise<void> {
        await addListener<SetTimelineTimeDescriptor>('set', descriptor => {
            if (descriptor.to._obj === 'timecode')
                callback(
                    descriptor.to.frameRate * descriptor.to.seconds +
                        descriptor.to.frame
                )
        })
    }

    static async addLayerVisibilityChangeListener(
        callback: (layerName: string, visible: boolean) => void
    ): Promise<void> {
        await addListener<HideDescriptor>('hide', descriptor => {
            callback(descriptor.null[0]._name, false)
        })
        await addListener<ShowDescriptor>('show', descriptor => {
            callback(descriptor.null[0]._name, true)
        })
    }
}

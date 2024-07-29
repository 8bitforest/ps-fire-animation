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
}

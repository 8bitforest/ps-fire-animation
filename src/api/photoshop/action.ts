import ps from 'photoshop'

export class ActionTarget {
    constructor(private _target: any) {}

    static fromLayer(id: number): ActionTarget {
        return new ActionTarget([{ _ref: 'layer', _id: id }])
    }

    async getPropertyAsync<T>(property: string): Promise<T> {
        const result = await ps.action.batchPlay(
            [{ _obj: 'get', _target: this._target, _property: property }],
            {}
        )
        return result[0][property]
    }

    // Adobe uses synchronous execution for their getters/setters despite warning against it. So we'll
    // just make sure to use it sparingly and with simple data.
    getProperty<T = any>(property: string): T {
        return ps.action.batchPlay(
            [{ _obj: 'get', _target: this._target, _property: property }],
            { synchronousExecution: true }
        ) as T
    }
}

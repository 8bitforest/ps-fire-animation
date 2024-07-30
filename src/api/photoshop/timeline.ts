import ps from 'photoshop'
import { ActionTarget } from './action'

interface Timecode {
    _obj: 'timecode'
    seconds: number
    frame: number
    frameRate: number
}

export class Timeline {
    static _target = new ActionTarget([
        { _ref: 'timeline', _enum: 'ordinal', _value: 'targetEnum' }
    ])
    static getCurrentTime(): Timecode {
        return this._target.getProperty<Timecode>('time')
    }

    static async setCurrentTime(frame: number) {
        const time = this.getCurrentTime()
        await ps.core.executeAsModal(
            async () => {
                await ps.action.batchPlay(
                    [
                        {
                            _obj: 'set',
                            _target: [
                                { _ref: 'property', _property: 'time' },
                                { _ref: 'timeline' }
                            ],
                            to: {
                                _obj: 'timecode',
                                seconds: 0,
                                frame: frame,
                                frameRate: time.frameRate
                            }
                        }
                    ],
                    {}
                )
            },
            { commandName: 'set current time' }
        )
    }
}

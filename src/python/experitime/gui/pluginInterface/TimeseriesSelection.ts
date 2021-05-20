import { Reducer } from "react"

const TIME_ZOOM_FACTOR = 1.4
const AMP_SCALE_FACTOR = 1.4

export interface TimeseriesSelection {
    startTime?: number
    endTime?: number
    maxTimeSpan?: number
    selectedChannelNames?: string[]
    visibleChannelNames?: string[]
    currentTimepoint?: number
    timeRange?: {min: number, max: number} | null
    ampScaleFactor?: number
}

const correctTimeseriesSelection = (s: TimeseriesSelection) => {
    let ret: TimeseriesSelection = s
    if (ret.timeRange) {
        if ((ret.startTime !== undefined) && (ret.endTime !== undefined))  {
            if (ret.timeRange.max > ret.endTime) {
                ret = {...ret, timeRange: {min: ret.timeRange.min - ret.timeRange.max + ret.endTime, max: ret.timeRange.max - ret.timeRange.max + ret.endTime} }
            }
        }
    }
    if (ret.timeRange) {
        if ((ret.startTime !== undefined) && (ret.endTime !== undefined))  {
            if (ret.timeRange.min < ret.startTime) {
                ret = {...ret, timeRange: {min: ret.timeRange.min - ret.timeRange.min + ret.startTime, max: ret.timeRange.max - ret.timeRange.min + ret.startTime} }
            }
        }
    }
    if (ret.timeRange) {
        if ((ret.startTime !== undefined) && (ret.endTime !== undefined))  {
            if (ret.timeRange.max > ret.endTime) {
                ret = {...ret, timeRange: {min: ret.timeRange.min, max: ret.endTime} }
            }
        }
    }
    return ret
}

export const sleepMsec = (m: number) => new Promise(r => setTimeout(r, m));

export type TimeseriesSelectionDispatch = (action: TimeseriesSelectionAction) => void

type SetStartEndTimeTimeseriesSelectionAction = {
    type: 'SetStartEndTime',
    startTime?: number
    endTime?: number
}

type SetTimeseriesSelectionTimeseriesSelectionAction = {
    type: 'SetTimeseriesSelection',
    timeseriesSelection: TimeseriesSelection
}

type SetSelectedChannelNamesTimeseriesSelectionAction = {
    type: 'SetSelectedChannelNames',
    selectedChannelNames: string[]
}

type SetVisibleChannelNamesTimeseriesSelectionAction = {
    type: 'SetVisibleChannelNames',
    visibleChannelNames: string[]
}

type SetCurrentTimepointTimeseriesSelectionAction = {
    type: 'SetCurrentTimepoint',
    currentTimepoint: number | null,
    ensureInRange?: boolean
}

type SetTimeRangeTimeseriesSelectionAction = {
    type: 'SetTimeRange',
    timeRange: {min: number, max: number} | null
}

type ZoomTimeRangeTimeseriesSelectionAction = {
    type: 'ZoomTimeRange',
    factor?: number             // uses default if unset
    direction?: 'in' | 'out'    // default direction is 'in'. If direction is set to 'out', 'factor' is inverted.
}

type SetAmpScaleFactorTimeseriesSelectionAction = {
    type: 'SetAmpScaleFactor',
    ampScaleFactor: number
}

type ScaleAmpScaleFactorTimeseriesSelectionAction = {
    type: 'ScaleAmpScaleFactor',
    multiplier?: number         // uses default if unset
    direction?: 'up' | 'down'   // default direction is 'up'. If direction is set to 'down', multiplier is inverted.
}

type SetTimeseriesSelectionAction = {
    type: 'Set',
    state: TimeseriesSelection
}

export type TimeseriesSelectionAction = SetStartEndTimeTimeseriesSelectionAction | SetTimeseriesSelectionTimeseriesSelectionAction | SetSelectedChannelNamesTimeseriesSelectionAction | SetVisibleChannelNamesTimeseriesSelectionAction | SetCurrentTimepointTimeseriesSelectionAction | SetTimeRangeTimeseriesSelectionAction | ZoomTimeRangeTimeseriesSelectionAction | SetAmpScaleFactorTimeseriesSelectionAction | ScaleAmpScaleFactorTimeseriesSelectionAction | SetTimeseriesSelectionAction

const adjustTimeRangeToIncludeTimepoint = (timeRange: {min: number, max: number}, timepoint: number) => {
    if ((timeRange.min <= timepoint) && (timepoint < timeRange.max)) return timeRange
    const span = timeRange.max - timeRange.min
    const t1 = Math.max(0, Math.floor(timepoint - span / 2))
    const t2 = t1 + span
    return {min: t1, max: t2}
}

export const timeseriesSelectionReducer: Reducer<TimeseriesSelection, TimeseriesSelectionAction> = (state: TimeseriesSelection, action: TimeseriesSelectionAction): TimeseriesSelection => {
    if (action.type === 'SetStartEndTime') {
        return correctTimeseriesSelection({...state, startTime: action.startTime, endTime: action.endTime})
    }
    else if (action.type === 'SetTimeseriesSelection') {
        return correctTimeseriesSelection({...action.timeseriesSelection})
    }
    else if (action.type === 'SetSelectedChannelNames') {
        return {
            ...state,
            selectedChannelNames: action.selectedChannelNames.filter(eid => ((!state.visibleChannelNames) || (state.visibleChannelNames.includes(eid))))
        }
    }
    else if (action.type === 'SetVisibleChannelNames') {
        return {
            ...state,
            visibleChannelNames: action.visibleChannelNames,
            selectedChannelNames: state.selectedChannelNames ? state.selectedChannelNames.filter(eid => (action.visibleChannelNames.includes(eid))) : undefined
        }
    }
    else if (action.type === 'SetCurrentTimepoint') {
        return {
            ...state,
            currentTimepoint: action.currentTimepoint || undefined,
            timeRange: action.ensureInRange && (state.timeRange) && (action.currentTimepoint !== null) ? adjustTimeRangeToIncludeTimepoint(state.timeRange, action.currentTimepoint) : state.timeRange
        }
    }
    else if (action.type === 'SetTimeRange') {
        return correctTimeseriesSelection({
            ...state,
            timeRange: action.timeRange
        })
    }
    else if (action.type === 'ZoomTimeRange') {
        const currentTimepoint = state.currentTimepoint
        const timeRange = state.timeRange
        if (!timeRange) return state
        const direction = action.direction ?? 'in'
        const pre_factor = action.factor ?? TIME_ZOOM_FACTOR
        const factor = direction === 'out' ? 1 / pre_factor : pre_factor
        
        // if ((timeRange.max - timeRange.min) / factor > maxTimeSpan ) return state
        let t: number
        if ((currentTimepoint === undefined) || (currentTimepoint < timeRange.min))
            t = timeRange.min
        else if (currentTimepoint > timeRange.max)
            t = timeRange.max
        else
            t = currentTimepoint
        const newTimeRange = zoomTimeRange(timeRange, factor, t)
        return correctTimeseriesSelection({
            ...state,
            timeRange: newTimeRange
        })
        // return fix({
        //     ...state,
        //     timeRange: newTimeRange
        // })
    }
    else if (action.type === 'SetAmpScaleFactor') {
        return {
            ...state,
            ampScaleFactor: action.ampScaleFactor
        }
    }
    else if (action.type === 'ScaleAmpScaleFactor') {
        const direction = action.direction ?? 'up'
        const pre_multiplier = action.multiplier ?? AMP_SCALE_FACTOR
        const multiplier = direction === 'down' ? 1 / pre_multiplier : pre_multiplier
        return {
            ...state,
            ampScaleFactor: (state.ampScaleFactor || 1) * multiplier
        }
    }
    else if (action.type === 'Set') {
        return correctTimeseriesSelection(action.state)
    }
    else return state
}

const zoomTimeRange = (timeRange: {min: number, max: number}, factor: number, anchorTime: number): {min: number, max: number} => {
    const oldT1 = timeRange.min
    const oldT2 = timeRange.max
    const t1 = anchorTime + (oldT1 - anchorTime) / factor
    const t2 = anchorTime + (oldT2 - anchorTime) / factor
    return {min: Math.floor(t1), max: Math.floor(t2)}
}
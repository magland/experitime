import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'
import { PainterPath } from '../../../commonComponents/CanvasWidget'
import { CanvasPainter } from '../../../commonComponents/CanvasWidget/CanvasPainter'
import useBufferedDispatch from '../../../commonComponents/useBufferedDispatch'
import { TimeseriesSelectionDispatch, TimeseriesSelection, timeseriesSelectionReducer } from '../../../pluginInterface/TimeseriesSelection'
import TimeWidgetNew, { TimeWidgetAction } from '../TimeWidgetNew/TimeWidgetNew'
import { TimeseriesData } from './useTimeseriesModel'
// import TimeseriesModelNew from './TimeseriesModelNew'

interface Props {
    timeseriesData: TimeseriesData
    channel_names: string[]
    // y_offsets: number[]
    y_scale_factor: number
    width: number
    height: number
    visibleChannelNames?: string[] | null
    timeseriesSelection?: TimeseriesSelection
    timeseriesSelectionDispatch?: TimeseriesSelectionDispatch
}

const channelColors = [
    'rgb(80,80,80)',
    'rgb(104,42,42)',
    'rgb(42,104,42)',
    'rgb(42,42,152)'
]


class Panel {
    // _updateHandler: (() => void) | null = null
    _timeRange: {min: number, max: number} | null = null
    _yScale: number = 1
    _pixelWidth: number | null = null // for determining the downsampling factor
    constructor(private channelName: string, private channelColor: string, private timeseriesData: TimeseriesData, private y_offset: number, private y_scale_factor: number) {
        // timeseriesData.onDataSegmentSet((ds_factor, t1, t2) => {
        //     const timeRange = this._timeRange
        //     if (!timeRange) return
        //     if ((t1 <= timeRange.max) && (t2 >= timeRange.min)) {
        //         this._updateHandler && this._updateHandler()
        //     }
        // })
    }
    setTimeRange(timeRange: {min: number, max: number}) {
        this._timeRange = timeRange
    }
    setYScale(s: number) {
        if (this._yScale === s) return
        this._yScale = s
        // this._updateHandler && this._updateHandler()
    }
    setPixelWidth(w: number) {
        if (this._pixelWidth === w) return
        this._pixelWidth = w
        // this._updateHandler && this._updateHandler()
    }
    paint(painter: CanvasPainter, completenessFactor: number) {
        const timeRange = this._timeRange
        if (!timeRange) return

        const deltaT = 1 / this.timeseriesData.samplingFrequency

        let downsample_factor = this._determineDownsampleFactor(completenessFactor)
        if (downsample_factor === null) return

        let t1, t2: number
        let data: {timestamps: number[], values: number[]}
        while (true) {
            t1 = timeRange.min
            t2 = timeRange.max

            data = this.timeseriesData.getChannelData(this.channelName, t1, t2, downsample_factor) // todo: ds factor
            if (data.timestamps.length > 0) {
                break
            }
            if (((t2 - t1) * this.timeseriesData.samplingFrequency / downsample_factor < 200) || (downsample_factor > 100)) {
                break
            }
            downsample_factor *= 3
        }

        const pp = new PainterPath()
        if (downsample_factor === 1) {
            let penDown = false;
            for (let ii = 0; ii < data.timestamps.length; ii ++) {
                const tt = data.timestamps[ii]
                let val = data.values[ii];
                if (!isNaN(val)) {
                    let val2 = ((val + this.y_offset) * this.y_scale_factor * this._yScale) / 2 + 0.5
                    if (penDown) {
                        pp.lineTo(tt, val2);    
                    }
                    else {
                        pp.moveTo(tt, val2);
                        penDown = true;
                    }
                }
                else {
                    penDown = false;
                }
            }
        }
        else {
            let penDown = false;
            for (let ii = 0; ii < data.timestamps.length; ii ++) {
                const tt = data.timestamps[ii]
                let val_min = data.values[ii * 2]
                let val_max = data.values[ii * 2 + 1]
                if ((!isNaN(val_min)) && (!isNaN(val_max))) {
                    let val2_min = ((val_min + this.y_offset) * this.y_scale_factor * this._yScale) / 2 + 0.5
                    let val2_max = ((val_max + this.y_offset) * this.y_scale_factor * this._yScale) / 2 + 0.5
                    if (penDown) {
                        pp.lineTo(tt - deltaT / 3, val2_min);
                        pp.lineTo(tt + deltaT / 3, val2_max);
                    }
                    else {
                        pp.moveTo(tt, val2_min);
                        pp.lineTo(tt, val2_max);
                        penDown = true;
                    }
                }
                else {
                    penDown = false;
                }
            }
        }

        const pen = {color: this.channelColor, width: 1}
        painter.drawPath(pp, pen)
    }
    _determineDownsampleFactor(completenessFactor: number) {
        completenessFactor = 1
        let timeRange = this._timeRange
        if (!timeRange) return null
        if (this._pixelWidth === null) return null
        const numChannels = this.timeseriesData.channelNames.length
        let factor0 = 1.3; // this is a tradeoff between rendering speed and appearance
        if (numChannels > 32) {
            factor0 = 0.5;
        }

        // determine what the downsample factor should be based on the number
        // of timepoints in the view range
        // we also need to consider the number of pixels it corresponds to
        const targetNumPix = Math.max(500, this._pixelWidth * factor0) * completenessFactor
        const numPoints = (timeRange.max - timeRange.min) * this.timeseriesData.samplingFrequency
        let ds_factor = 1;
        let factor = 3;
        while (numPoints / (ds_factor * factor) > targetNumPix) {
            ds_factor *= factor
        }
        return ds_factor;
    }
    label() {
        return this.channelName
    }
    // register(onUpdate: () => void) {
    //     this._updateHandler = onUpdate
    // }
}

const TimeseriesWidgetNew = (props: Props) => {
    const { timeseriesData, width, height, y_scale_factor, channel_names, visibleChannelNames, timeseriesSelection: externalSelection, timeseriesSelectionDispatch: externalSelectionDispatch } = props
    const [panels, setPanels] = useState<Panel[]>([])
    const [timeseriesSelection, timeseriesSelectionDispatch] = useBufferedDispatch(timeseriesSelectionReducer, externalSelection || {}, useMemo(() => ((state: TimeseriesSelection) => {externalSelectionDispatch && externalSelectionDispatch({type: 'Set', state})}), [externalSelectionDispatch]), 200)
    
    const [actions, setActions] = useState<TimeWidgetAction[] | null>(null)
    const _handleScaleAmplitudeUp = useCallback(() => {
        timeseriesSelectionDispatch({type: 'ScaleAmpScaleFactor', direction: 'up'})
    }, [timeseriesSelectionDispatch])
    const _handleScaleAmplitudeDown = useCallback(() => {
        timeseriesSelectionDispatch({type: 'ScaleAmpScaleFactor', direction: 'down'})
    }, [timeseriesSelectionDispatch])

    useEffect(() => {
        const panels0: Panel[] = []
        for (let channelInd = 0; channelInd < timeseriesData.channelNames.length; channelInd ++) {
            // todo: i guess we need to redefine the panels whenever y_offsets or y_scale_factor or channel_names change
            const channel_name = timeseriesData.channelNames[channelInd]
            if ((!visibleChannelNames) || (visibleChannelNames.includes(channel_name))) {
                const color = channelColors[channelInd % channelColors.length]
                const p = new Panel(channel_name, color, timeseriesData, 0, y_scale_factor) // y_offsets[ch] replaced with 0
                p.setPixelWidth(width)
                p.setYScale(timeseriesSelection.ampScaleFactor || 1)
                panels0.push(p)
            }
        }
        setPanels(panels0)
    }, [channel_names, setPanels, timeseriesData, y_scale_factor, width, timeseriesSelection.ampScaleFactor, timeseriesSelection.timeRange, visibleChannelNames])
    useEffect(() => {
        if (actions === null) {
            const a: TimeWidgetAction[] = [
                {
                    type: 'button',
                    callback: _handleScaleAmplitudeUp,
                    title: 'Scale amplitude up [up arrow]',
                    icon: <FaArrowUp />,
                    keyCode: 38
                },
                {
                    type: 'button',
                    callback: _handleScaleAmplitudeDown,
                    title: 'Scale amplitude down [down arrow]',
                    icon: <FaArrowDown />,
                    keyCode: 40
                },
                {
                    type: 'divider'
                }
            ]
            setActions(a)
        }
    }, [actions, setActions, _handleScaleAmplitudeDown, _handleScaleAmplitudeUp, timeseriesSelection.ampScaleFactor, width])

    // const numTimepoints = useMemo(() => (timeseriesData ? timeseriesData.numTimepoints() : 0), [timeseriesData])

    return (
        <TimeWidgetNew
            panels={panels}
            customActions={actions}
            width={width}
            height={height}
            samplerate={timeseriesData.samplingFrequency}
            startTimeSpan={1e7 / timeseriesData.samplingFrequency / timeseriesData.channelNames.length}
            maxTimeSpan={1e7 / timeseriesData.samplingFrequency / timeseriesData.channelNames.length}
            timeseriesStartTime={timeseriesData.startTime}
            timeseriesEndTime={timeseriesData.endTime}
            selection={timeseriesSelection}
            selectionDispatch={timeseriesSelectionDispatch}
        />
    )
}

export default TimeseriesWidgetNew
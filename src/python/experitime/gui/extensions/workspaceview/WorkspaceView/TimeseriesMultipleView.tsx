import React, { useEffect, useMemo, useReducer } from 'react'
import { FunctionComponent } from "react"
import { TaskStatusView } from '../../../labbox'
import { timeseriesSelectionReducer } from '../../../pluginInterface/TimeseriesSelection'
import { WorkspaceExperiment } from '../../../pluginInterface/workspaceReducer'
import { WorkspaceViewProps } from '../../../pluginInterface/WorkspaceViewPlugin'
import TimeseriesViewNew from '../../timeseries/TimeseriesViewNew/TimeseriesViewNew'
import useExperimentInfo from './useExperimentInfo'

const useSetupTimeseriesSelection = (timeseriesInfo: {samplingFrequency: number, startTime: number, endTime: number} | undefined) => {
    const [timeseriesSelection, timeseriesSelectionDispatch] = useReducer(timeseriesSelectionReducer, {})
    useEffect(() => {
        if (!timeseriesInfo) return
        const maxTimeSpan = 1e5 / timeseriesInfo.samplingFrequency
        timeseriesSelectionDispatch({
            type: 'Set',
            state: {
                maxTimeSpan,
                timeRange: {min: timeseriesInfo.startTime, max: Math.min(timeseriesInfo.startTime + maxTimeSpan, timeseriesInfo.endTime)}
            }
        })
    }, [timeseriesInfo])

    return {timeseriesSelection, timeseriesSelectionDispatch}
}

const TimeseriesMultipleView: FunctionComponent<WorkspaceViewProps & {experimentId: string, timeseriesNames: string[]}> = ({ experimentId, timeseriesNames, workspace, workspaceDispatch, workspaceRoute, workspaceRouteDispatch, width=500, height=500 }) => {
    if (timeseriesNames.length === 0) throw Error('Unexpected: timeseriesNames list is empty in TimeseriesMultipleView')
    const experiment = useMemo((): WorkspaceExperiment | undefined => (
        workspace.experiments.filter(x => (x.experimentId === experimentId))[0]
    ), [workspace, experimentId])
    const {experimentInfo, task} = useExperimentInfo(experiment?.uri)
    const timeseriesInfos = experimentInfo ? timeseriesNames.map(timeseriesName => (experimentInfo?.timeseries[timeseriesName])) : undefined
    const firstTimeseriesInfo = timeseriesInfos ? timeseriesInfos[0] : undefined
    const {timeseriesSelection, timeseriesSelectionDispatch} = useSetupTimeseriesSelection(firstTimeseriesInfo)
    useEffect(() => {
        timeseriesSelectionDispatch({
            type: 'SetStartEndTime',
            startTime: firstTimeseriesInfo?.startTime,
            endTime: firstTimeseriesInfo?.endTime
        })
    }, [firstTimeseriesInfo, timeseriesSelectionDispatch])
    const heights = useMemo(() => (timeseriesNames.map((timeseriesName) => {
        return height / timeseriesNames.length
    })), [timeseriesNames, height])
    if (!experimentInfo) return <TaskStatusView task={task} label="Get experiment info" />
    if (!timeseriesInfos) return <span>No timeseries infos</span>

    return (
        <div>
            {
                timeseriesNames.map((timeseriesName, i) => {
                    return <TimeseriesViewNew
                        timeseriesInfo={timeseriesInfos[i]}
                        width={width}
                        height={heights[i]}
                        opts={{
                            channelSelectPanel: true
                        }}
                        timeseriesSelection={timeseriesSelection}
                        timeseriesSelectionDispatch={timeseriesSelectionDispatch}
                    />
                })
            }
        </div>
    )
}

export default TimeseriesMultipleView
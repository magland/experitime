import React, { useEffect, useMemo, useReducer } from 'react'
import { FunctionComponent } from "react"
import { TaskStatusView } from '../../../labbox'
import { timeseriesSelectionReducer } from '../../../pluginInterface/TimeseriesSelection'
import { WorkspaceExperiment } from '../../../pluginInterface/workspaceReducer'
import { WorkspaceViewProps } from '../../../pluginInterface/WorkspaceViewPlugin'
import TimeseriesViewNew from '../../timeseries/TimeseriesViewNew/TimeseriesViewNew'
import useExperimentInfo, { TimeseriesInfo } from './useExperimentInfo'

const useSetupTimeseriesSelection = (timeseriesInfo: TimeseriesInfo | undefined) => {
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

const TimeseriesView: FunctionComponent<WorkspaceViewProps & {experimentId: string, timeseriesName: string}> = ({ experimentId, timeseriesName, workspace, workspaceDispatch, workspaceRoute, workspaceRouteDispatch, width=500, height=500 }) => {
    const experiment = useMemo((): WorkspaceExperiment | undefined => (
        workspace.experiments.filter(x => (x.experimentId === experimentId))[0]
    ), [workspace, experimentId])
    const {experimentInfo, task} = useExperimentInfo(experiment?.uri)
    const timeseriesInfo = experimentInfo?.timeseries[timeseriesName]
    const {timeseriesSelection, timeseriesSelectionDispatch} = useSetupTimeseriesSelection(timeseriesInfo)
    useEffect(() => {
        timeseriesSelectionDispatch({
            type: 'SetStartEndTime',
            startTime: timeseriesInfo?.startTime,
            endTime: timeseriesInfo?.endTime
        })
    }, [timeseriesInfo, timeseriesSelectionDispatch])
    if (!experimentInfo) return <TaskStatusView task={task} label="Get experiment info" />
    if (!timeseriesInfo) return <span>No timeseries info</span>

    return (
        <div>
            <TimeseriesViewNew
                timeseriesInfo={timeseriesInfo}
                width={width}
                height={height}
                opts={{
                    channelSelectPanel: true
                }}
                timeseriesSelection={timeseriesSelection}
                timeseriesSelectionDispatch={timeseriesSelectionDispatch}
            />
        </div>
    )
}

export default TimeseriesView
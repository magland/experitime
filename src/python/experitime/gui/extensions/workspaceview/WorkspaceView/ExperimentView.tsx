import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Hyperlink from '../../../commonComponents/Hyperlink/Hyperlink';
import { TaskStatusView } from '../../../labbox';
import { WorkspaceExperiment } from '../../../pluginInterface/workspaceReducer';
import { WorkspaceViewProps } from '../../../pluginInterface/WorkspaceViewPlugin';
import ExperimentTimeseriesTable from './ExperimentTimeseriesTable';
import useExperimentInfo from './useExperimentInfo';

export interface LocationInterface {
  pathname: string
  search: string
}

export interface HistoryInterface {
  location: LocationInterface
  push: (x: LocationInterface) => void
}



const ExperimentView: FunctionComponent<WorkspaceViewProps & {experimentId: string}> = ({ experimentId, workspace, workspaceDispatch, workspaceRoute, workspaceRouteDispatch, width=500, height=500 }) => {
  const experiment = useMemo((): WorkspaceExperiment | undefined => (
    workspace.experiments.filter(x => (x.experimentId === experimentId))[0]
  ), [workspace, experimentId])
  const {experimentInfo, task} = useExperimentInfo(experiment?.uri)
  const handleClickTimeseries = useCallback((timeseriesName: string) => {
      workspaceRouteDispatch({
        type: 'gotoTimeseriesPage',
        experimentId,
        timeseriesName
      })
  }, [workspaceRouteDispatch, experimentId])
  const handleGotoWorkspace = useCallback(() => {
      workspaceRouteDispatch({
        type: 'gotoMainPage'
      })
  }, [workspaceRouteDispatch])
  const handleViewTimeseriesMultiple = useCallback((timeseriesNames: string[]) => {
    workspaceRouteDispatch({
      type: 'gotoTimeseriesMultiplePage',
      experimentId,
      timeseriesNames
    })
  }, [experimentId, workspaceRouteDispatch])
  if (!experiment) return <span>Experiment not found.</span>
  if (!experimentInfo) {
    return <TaskStatusView task={task} label="get experiment info" />
  }
  return (
    <div>
      <div style={{marginBottom: 20}}><Hyperlink onClick={handleGotoWorkspace}>Back to workspace</Hyperlink></div>
      <div style={{marginBottom: 10}}>Experiment: {experiment.label} ({experiment.experimentId})</div>
      <ExperimentTimeseriesTable
        experimentInfo={experimentInfo}
        onClickTimeseries={handleClickTimeseries}
        onViewTimeseriesMultiple={handleViewTimeseriesMultiple}
      />
    </div>
  )
}

export default ExperimentView
import React, { FunctionComponent, useCallback } from 'react';
import Hyperlink from '../../../commonComponents/Hyperlink/Hyperlink';
import { WorkspaceViewProps } from '../../../pluginInterface/WorkspaceViewPlugin';
import ExperimentsView from './ExperimentsView';
import ExperimentView from './ExperimentView';
import TimeseriesMultipleView from './TimeseriesMultipleView';
import TimeseriesView from './TimeseriesView';

export interface LocationInterface {
  pathname: string
  search: string
}

export interface HistoryInterface {
  location: LocationInterface
  push: (x: LocationInterface) => void
}

const WorkspaceView: FunctionComponent<WorkspaceViewProps> = ({ workspace, workspaceDispatch, workspaceRoute, workspaceRouteDispatch, width=500, height=500 }) => {
  const handleGotoExperiment = useCallback(() => {
    if ((workspaceRoute.page === 'timeseries') || (workspaceRoute.page === 'timeseriesMultiple')) { // for typing
      workspaceRouteDispatch({
        type: 'gotoExperimentPage',
        experimentId: workspaceRoute.experimentId
      })
    }
  }, [workspaceRoute, workspaceRouteDispatch])
  if (workspaceRoute.page === 'experiment') {
    return (
      <ExperimentView
        {...{experimentId: workspaceRoute.experimentId, workspace, workspaceDispatch, workspaceRoute, workspaceRouteDispatch, width, height}}
      />
    )
  }
  else if (workspaceRoute.page === 'timeseries') {
    return (
      <div>
        <div style={{marginBottom: 10}}>
          <Hyperlink onClick={handleGotoExperiment}>Back to experiment</Hyperlink>
        </div>
        <div style={{marginBottom: 10}}>
          {workspaceRoute.timeseriesName}
        </div>
        <TimeseriesView
          {...{experimentId: workspaceRoute.experimentId, timeseriesName: workspaceRoute.timeseriesName, workspace, workspaceDispatch, workspaceRoute, workspaceRouteDispatch, width, height: height - 45}}
        />
      </div>
    )
  }
  else if (workspaceRoute.page === 'timeseriesMultiple') {
    return (
      <div>
        <div style={{marginBottom: 10}}>
          <Hyperlink onClick={handleGotoExperiment}>Back to experiment</Hyperlink>
        </div>
        <TimeseriesMultipleView
          {...{experimentId: workspaceRoute.experimentId, timeseriesNames: workspaceRoute.timeseriesNames, workspace, workspaceDispatch, workspaceRoute, workspaceRouteDispatch, width, height: height - 45}}
        />
      </div>
    )
  }
  else {
    return (
      <ExperimentsView
        {...{workspace, workspaceDispatch, workspaceRoute, workspaceRouteDispatch, width, height}}
      />
    )
  }
}

export default WorkspaceView

// jinjaroot synctool exclude
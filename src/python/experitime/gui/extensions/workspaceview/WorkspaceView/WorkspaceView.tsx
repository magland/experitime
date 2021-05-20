import React, { FunctionComponent } from 'react';
import { WorkspaceViewProps } from '../../../pluginInterface/WorkspaceViewPlugin';
import ExperimentsView from './ExperimentsView';
import ExperimentView from './ExperimentView';
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
  if (workspaceRoute.page === 'experiment') {
    return (
      <ExperimentView
        {...{experimentId: workspaceRoute.experimentId, workspace, workspaceDispatch, workspaceRoute, workspaceRouteDispatch, width, height}}
      />
    )
  }
  else if (workspaceRoute.page === 'timeseries') {
    return (
      <TimeseriesView
        {...{experimentId: workspaceRoute.experimentId, timeseriesName: workspaceRoute.timeseriesName, workspace, workspaceDispatch, workspaceRoute, workspaceRouteDispatch, width, height}}
      />
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
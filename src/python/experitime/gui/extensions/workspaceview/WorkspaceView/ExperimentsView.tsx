import { Button } from '@material-ui/core';
import React, { FunctionComponent, useCallback } from 'react';
import Splitter from '../../../commonComponents/Splitter/Splitter';
import { useVisible } from '../../../labbox';
import { WorkspaceViewProps } from '../../../pluginInterface/WorkspaceViewPlugin';
import AddExperimentInstructions from './AddExperimentInstructions';
import ExperimentsTable from './ExperimentsTable';

export interface LocationInterface {
  pathname: string
  search: string
}

export interface HistoryInterface {
  location: LocationInterface
  push: (x: LocationInterface) => void
}

const ExperimentsView: FunctionComponent<WorkspaceViewProps> = ({ workspace, workspaceDispatch, workspaceRoute, workspaceRouteDispatch, width=500, height=500 }) => {
  const handleExperimentSelected = useCallback((experimentId: string) => {
      workspaceRouteDispatch({
        type: 'gotoExperimentPage',
        experimentId
      })
  }, [workspaceRouteDispatch])

  const {visible: instructionsVisible, show: showInstructions} = useVisible()
  return (
    <Splitter
            {...{width, height}}
            initialPosition={300}
            positionFromRight={true}
    >
      <div>
          {
              !instructionsVisible && (
                  <div><Button onClick={showInstructions}>Add experiment</Button></div>
              )
          }
          <ExperimentsTable
            experiments={workspace.experiments}
            onExperimentSelected={handleExperimentSelected}
          />
      </div>
      {
          instructionsVisible && (
              <AddExperimentInstructions />
          )
      }
      
    </Splitter>
  )
}

export default ExperimentsView
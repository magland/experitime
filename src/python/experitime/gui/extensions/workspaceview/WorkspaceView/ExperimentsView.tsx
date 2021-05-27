import { Button } from '@material-ui/core';
import React, { FunctionComponent, useCallback } from 'react';
import MarkdownDialog from '../../../commonComponents/Markdown/MarkdownDialog';
import { useVisible } from '../../../labbox';
import ModalWindow from '../../../labbox/ApplicationBar/ModalWindow';
import { WorkspaceViewProps } from '../../../pluginInterface/WorkspaceViewPlugin';
import AddExperimentInstructions from './AddExperimentInstructions';
import ExperimentsTable from './ExperimentsTable';
import workspacePermissionsMd from './workspacePermissions.md.gen'

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

  const {visible: addExperimentInstructionsVisible, show: showAddExperimentInstructions, hide: hideAddExperimentInstructions} = useVisible()
  const {visible: workspaceSettingsVisible, show: showWorkspaceSettings, hide: hideWorkspaceSettings} = useVisible()

  const handleDeleteExperiments = useCallback((experimentIds: string[]) => {
      workspaceDispatch && workspaceDispatch({
        type: 'deleteExperiments',
        experimentIds
      })
  }, [workspaceDispatch])

  const readOnly = workspaceDispatch ? false : true

  return (
    <div>
      <div>
        <div><Button onClick={showAddExperimentInstructions}>Add experiment</Button></div>
        <div><Button onClick={showWorkspaceSettings}>Set workspace permissions</Button></div>
        <ExperimentsTable
          experiments={workspace.experiments}
          onExperimentSelected={handleExperimentSelected}
          onDeleteExperiments={readOnly ? undefined : handleDeleteExperiments}
        />
      </div>
      <ModalWindow
            open={addExperimentInstructionsVisible}
            onClose={hideAddExperimentInstructions}
        >
          <AddExperimentInstructions />
      </ModalWindow>
      <MarkdownDialog
        visible={workspaceSettingsVisible}
        onClose={hideWorkspaceSettings}
        source={workspacePermissionsMd}
        substitute={{workspaceUri: workspaceRoute.workspaceUri}}
      />
    </div>
  )
}

export default ExperimentsView
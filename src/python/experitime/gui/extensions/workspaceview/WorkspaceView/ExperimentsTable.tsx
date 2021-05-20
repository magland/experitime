import React, { FunctionComponent, useCallback, useMemo } from 'react';
import Hyperlink from '../../../commonComponents/Hyperlink/Hyperlink';
import NiceTable from '../../../commonComponents/NiceTable/NiceTable';
import { WorkspaceExperiment } from '../../../pluginInterface/workspaceReducer';
import './WorkspaceView.css';

interface Props {
    experiments: WorkspaceExperiment[]
    onDeleteExperiments?: (experimentIds: string[]) => void
    onExperimentSelected?: (experimentId: string) => void
}
const ExperimentsTable: FunctionComponent<Props> = ({ experiments, onDeleteExperiments, onExperimentSelected }) => {
    const columns = useMemo(() => ([
        {
            key: 'label',
            label: 'Experiment'
        }
    ]), [])

    const rows = useMemo(() => (experiments.map(x => {
        return {
            key: x.experimentId,
            columnValues: {
                label: {
                    text: x.label,
                    element: <Hyperlink onClick={onExperimentSelected ? (() => {onExperimentSelected(x.experimentId)}) : undefined}>{x.label}</Hyperlink>
                }
            }
        }
    })), [experiments, onExperimentSelected])

    const handleDeleteRow = useCallback((experimentId: string) => {
        onDeleteExperiments && onDeleteExperiments([experimentId])
    }, [onDeleteExperiments])

    

    return (
        <div>
            <NiceTable
                rows={rows}
                columns={columns}
                deleteRowLabel={"Remove this experiment"}
                onDeleteRow={onDeleteExperiments ? handleDeleteRow : undefined}
            />
        </div>
    );
}

export default ExperimentsTable
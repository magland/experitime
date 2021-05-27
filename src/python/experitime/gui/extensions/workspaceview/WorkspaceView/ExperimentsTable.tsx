import { Button } from '@material-ui/core';
import React, { FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
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

    // const handleDeleteRow = useCallback((experimentId: string) => {
    //     onDeleteExperiments && onDeleteExperiments([experimentId])
    // }, [onDeleteExperiments])

    const [selectedExperimentIds, setSelectedExperimentIds] = useState<string[]>([])

    const [confirmingDelete, setConfirmingDelete] = useState(false)
    const confirmOn = useCallback(() => {setConfirmingDelete(true)}, [])
    const confirmOff = useCallback(() => {setConfirmingDelete(false)}, [])
    useEffect(() => {confirmOff()}, [selectedExperimentIds, confirmOff])
    const handleDeleteSelectedExperiments = useCallback(() => {
        onDeleteExperiments && onDeleteExperiments(selectedExperimentIds)
        confirmOff()
    }, [onDeleteExperiments, selectedExperimentIds, confirmOff])

    return (
        <div>
            {
                selectedExperimentIds.length > 0 && (
                    confirmingDelete ? (
                        <span>Confirm delete {selectedExperimentIds.length} experiments? <button onClick={handleDeleteSelectedExperiments}>Delete</button> <button onClick={confirmOff}>Cancel</button></span>
                    ) : (
                        <Button onClick={confirmOn}>Delete selected experiments</Button>
                    )
                )
            }
            <NiceTable
                rows={rows}
                columns={columns}
                deleteRowLabel={"Remove this experiment"}
                // onDeleteRow={onDeleteExperiments ? handleDeleteRow : undefined}
                selectedRowKeys={selectedExperimentIds}
                onSelectedRowKeysChanged={setSelectedExperimentIds}
                selectionMode={onDeleteExperiments ? "multiple" : "none"}
            />
        </div>
    );
}

export default ExperimentsTable
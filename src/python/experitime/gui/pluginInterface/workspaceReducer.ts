export type WorkspaceExperiment = {
    experimentId: string
    label: string
    uri: string
}

export type WorkspaceState = {
    experiments: WorkspaceExperiment[]
}

export type WorkspaceAction = {
    type: 'addExperiment'
    experimentId: string
    label: string
    uri: string
} | {
    type: 'deleteExperiments'
    experimentIds: string[]
}

const workspaceReducer = (s: WorkspaceState, a: WorkspaceAction): WorkspaceState => {
    if (a.type === 'addExperiment') {
        if (s.experiments.filter(x => (x.experimentId === a.experimentId))[0]) return s
        return {
            ...s,
            experiments: [...s.experiments, {experimentId: a.experimentId, uri: a.uri, label: a.label}]
        }
    }
    else if (a.type === 'deleteExperiments') {
        return {...s, experiments: s.experiments.filter(x => (!(a.experimentIds.includes(x.experimentId))))}
    }
    return s
}

export const initialWorkspaceState: WorkspaceState = {experiments: []}

export type WorkspaceDispatch = (a: WorkspaceAction) => void

export default workspaceReducer

// jinjaroot synctool exclude
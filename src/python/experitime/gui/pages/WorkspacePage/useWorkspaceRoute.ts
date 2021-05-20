import { useCallback, useMemo } from "react"
import { WorkspaceRoute } from "../../pluginInterface"
import { WorkspaceRouteAction } from "../../pluginInterface/WorkspaceRoute"
import useRoute from "../../route/useRoute"

const useWorkspaceRoute = () => {
    const {workspaceUri, routePath, setRoute} = useRoute()
    if (!workspaceUri) throw Error('Unexpected: workspaceUri is undefined')

    const workspaceRoute = useMemo((): WorkspaceRoute => {
        if (routePath.startsWith('/workspace/experiment/')) {
            const p = routePath.split('/')
            const experimentId = p[3]
            if (p[4] === 'timeseries') {
                const timeseriesName = p[5] || ''
                return {
                    page: 'timeseries',
                    experimentId,
                    timeseriesName,
                    workspaceUri
                }
            }
            else {
                return {
                    page: 'experiment',
                    experimentId,
                    workspaceUri
                }
            }
        }
        else {
            return {
                page: 'main',
                workspaceUri
            }
        }
    }, [workspaceUri, routePath])
    const workspaceRouteDispatch = useCallback((action: WorkspaceRouteAction) => {
        if (action.type === 'gotoMainPage') {
            setRoute({routePath: '/workspace'})
        }
        else if (action.type === 'gotoExperimentPage') {
            setRoute({routePath: `/workspace/experiment/${action.experimentId}`})
        }
        else if (action.type === 'gotoTimeseriesPage') {
            setRoute({routePath: `/workspace/experiment/${action.experimentId}/timeseries/${action.timeseriesName}`})
        }
    }, [setRoute])

    return {workspaceRoute, workspaceRouteDispatch}
}

export default useWorkspaceRoute

// jinjaroot synctool exclude
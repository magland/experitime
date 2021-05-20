import QueryString from 'querystring'

type Page = 'main' | 'experiment'
export const isWorkspacePage = (x: string): x is Page => {
    return ['main', 'experiment'].includes(x)
}

type WorkspaceMainRoute = {
    workspaceUri?: string
    page: 'main'
}
type WorkspaceExperimentRoute = {
    workspaceUri?: string
    page: 'experiment'
    experimentId: string
}
type WorkspaceTimeseriesRoute = {
    workspaceUri?: string
    page: 'timeseries'
    experimentId: string
    timeseriesName: string
}
export type WorkspaceRoute = WorkspaceMainRoute | WorkspaceExperimentRoute | WorkspaceTimeseriesRoute
type GotoMainPageAction = {
    type: 'gotoMainPage'
}
type GotoExperimentPageAction = {
    type: 'gotoExperimentPage'
    experimentId: string
}
type GotoTimeseriesPageAction = {
    type: 'gotoTimeseriesPage'
    experimentId: string
    timeseriesName: string
}
export type WorkspaceRouteAction = GotoMainPageAction | GotoExperimentPageAction | GotoTimeseriesPageAction
export type WorkspaceRouteDispatch = (a: WorkspaceRouteAction) => void

export interface LocationInterface {
    pathname: string
    search: string
}

export interface HistoryInterface {
    location: LocationInterface
    push: (x: LocationInterface) => void
}

export const routeFromLocation = (location: LocationInterface): WorkspaceRoute => {
    const pathList = location.pathname.split('/')

    const query = QueryString.parse(location.search.slice(1));
    const workspace = (query.workspace as string) || 'default'
    const workspaceUri = workspace.startsWith('workspace://') ? workspace : undefined

    const page = pathList[1] || 'main'
    if (!isWorkspacePage(page)) throw Error(`Invalid page: ${page}`)
    switch (page) {
        case 'main': return {
            workspaceUri,
            page
        }
        case 'experiment': return {
            workspaceUri,
            page,
            experimentId: pathList[2]
        }
        default: return {
            workspaceUri,
            page: 'main'
        }
    }
}

export const locationFromRoute = (route: WorkspaceRoute) => {
    const queryParams: { [key: string]: string } = {}
    if (route.workspaceUri) {
        queryParams['workspace'] = route.workspaceUri
    }
    switch (route.page) {
        case 'main': return {
            pathname: `/`,
            search: queryString(queryParams)
        }
        case 'experiment': return {
            pathname: `/experiment/${route.experimentId}`,
            search: queryString(queryParams)
        }
    }
}

var queryString = (params: { [key: string]: string }) => {
    const keys = Object.keys(params)
    if (keys.length === 0) return ''
    return '?' + (
        keys.map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
        }).join('&')
    )
}

export const workspaceRouteReducer = (s: WorkspaceRoute, a: WorkspaceRouteAction): WorkspaceRoute => {
    let newRoute: WorkspaceRoute = s
    switch (a.type) {
        case 'gotoMainPage': newRoute = {
            page: 'main',
            workspaceUri: s.workspaceUri
        }; break;
        case 'gotoExperimentPage': newRoute = {
            page: 'experiment',
            experimentId: a.experimentId,
            workspaceUri: s.workspaceUri
        }; break;
        case 'gotoTimeseriesPage': newRoute = {
            page: 'timeseries',
            experimentId: a.experimentId,
            timeseriesName: a.timeseriesName,
            workspaceUri: s.workspaceUri
        }; break;
    }
    return newRoute
}

// jinjaroot synctool exclude
type RoutePath = '/home' | '/about' | '/selectWorkspace' | '/workspace' | '/workspace/experiment/id' | string
export const isRoutePath = (x: string): x is RoutePath => {
    if (x.startsWith('/workspace/experiment/')) return true
    if (['/home', '/about', '/selectWorkspace', '/workspace'].includes(x)) return true
    return false
}

export default RoutePath

// jinjaroot synctool exclude
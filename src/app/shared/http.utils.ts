/**
 * Helper to create the backend request with proper url
**/
export function createBackendRequest(apiGatewayUrl: string, route: string) {
    let finalRoute = route.startsWith('/') ? route.substring(1) : route;
    let apiGateWayFinal = apiGatewayUrl.endsWith('/') 
        ? apiGatewayUrl
        : apiGatewayUrl + '/'; 
    return apiGateWayFinal + finalRoute;
}
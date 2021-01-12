import {ComponentRef} from '@angular/core';
import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

// Sources
// ://github.com/angular/angular/issues/13869
// ://stackoverflow.com/questions/41280471/how-to-implement-routereusestrategy-shoulddetach-for-specific-routes-in-angular#answer-41515648

interface RouteStates {
    max: number;
    handles: {[handleKey: string]: DetachedRouteHandle};
    handleKeys: string[];
}

function getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join('/')).join('/');
}

function getConfiguredUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
        .filter(v => v.routeConfig)
        .map(v => v.routeConfig!.path)
        .join('/');
}

function getStoreKey(route: ActivatedRouteSnapshot): string {
    const baseUrl = getResolvedUrl(route);

    // this works, as ActivatedRouteSnapshot has only every one children ActivatedRouteSnapshot
    // as you can't have more since urls like `/project/1,2` where you'd want to display 1 and 2 project at the
    // same time
    const childrenParts = [];
    let deepestChild = route;
    while (deepestChild.firstChild) {
        deepestChild = deepestChild.firstChild;
        childrenParts.push(deepestChild.url.join('/'));
    }

    // it's important to separate baseUrl with childrenParts so we don't have collisions.
    return baseUrl + '////' + childrenParts.join('/');
}

const routes: {[routePath: string]: RouteStates} = {
    '/home': {max: 1, handles: {}, handleKeys: []},
    '/collection/:collectionId': {max: 1, handles: {}, handleKeys: []},
    '/my-collection/unclassified': {max: 1, handles: {}, handleKeys: []},
    '/my-collection/my-cards': {max: 1, handles: {}, handleKeys: []},
    '/my-collection/my-collection': {max: 1, handles: {}, handleKeys: []},
    '/source': {max: 1, handles: {}, handleKeys: []},
};

export class AppRouteReuseStrategy implements RouteReuseStrategy {
    /** Determines if this route (and its subtree) should be detached to be reused later */
    public shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return !!routes[getConfiguredUrl(route)];
    }

    /**
     * Stores the detached route.
     *
     * Storing a `null` value should erase the previously stored value.
     */
    public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
        if (!route.routeConfig || !handle) {
            return;
        }

        const config = routes[getConfiguredUrl(route)];

        if (config) {
            const storeKey = getStoreKey(route);

            if (!config.handles[storeKey]) {
                // add new handle
                if (config.handleKeys.length >= config.max) {
                    const oldestUrl = config.handleKeys[0];
                    config.handleKeys.splice(0, 1);

                    // this is important to work around memory leaks, as Angular will never destroy the Component
                    // on its own once it got stored in our router strategy.
                    const oldHandle = config.handles[oldestUrl] as {componentRef: ComponentRef<any>};
                    oldHandle.componentRef.destroy();

                    delete config.handles[oldestUrl];
                }
                config.handles[storeKey] = handle;
                config.handleKeys.push(storeKey);
            }
        }
    }

    /** Determines if this route (and its subtree) should be reattached */
    public shouldAttach(route: ActivatedRouteSnapshot): boolean {
        if (route.routeConfig) {
            const config = routes[getConfiguredUrl(route)];

            if (config) {
                const storeKey = getStoreKey(route);
                return !!config.handles[storeKey];
            }
        }

        return false;
    }

    /** Retrieves the previously stored route */
    public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        if (route.routeConfig) {
            const config = routes[getConfiguredUrl(route)];

            if (config) {
                const storeKey = getStoreKey(route);
                return config.handles[storeKey];
            }
        }

        return null;
    }

    /** Determines if `curr` route should be reused */
    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return getResolvedUrl(future) === getResolvedUrl(curr) && future.routeConfig === curr.routeConfig;
    }
}

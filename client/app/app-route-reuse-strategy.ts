import {ComponentRef} from '@angular/core';
import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

// Sources
// https://github.com/angular/angular/issues/13869#issuecomment-441054267
// https://https://stackoverflow.com/questions/41280471/how-to-implement-routereusestrategy-shoulddetach-for-specific-routes-in-angular#answer-41515648

interface RouteStates {
    readonly max: number;
    readonly handles: Map<string, DetachedRouteHandle & {componentRef?: ComponentRef<unknown>}>;
    readonly handleKeys: string[];
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

const routes: Readonly<Record<string, RouteStates>> = {
    '/home': {max: 1, handles: new Map(), handleKeys: []},
    '/collection/:collectionId': {max: 1, handles: new Map(), handleKeys: []},
    '/my-collection/unclassified': {max: 1, handles: new Map(), handleKeys: []},
    '/my-collection/my-cards': {max: 1, handles: new Map(), handleKeys: []},
    '/my-collection/my-collection': {max: 1, handles: new Map(), handleKeys: []},
    '/source': {max: 1, handles: new Map(), handleKeys: []},

    // Needs to be higher than the maximum different collections navigated during a session
    '/collection': {max: 100, handles: new Map(), handleKeys: []},
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
        if (!config) {
            return;
        }

        const storeKey = getStoreKey(route);
        if (config.handles.has(storeKey)) {
            return;
        }

        if (config.handleKeys.length >= config.max) {
            const oldestUrl = config.handleKeys[0];
            config.handleKeys.splice(0, 1);

            // this is important to work around memory leaks, as Angular will never destroy the Component
            // on its own once it got stored in our router strategy.
            const oldHandle = config.handles.get(oldestUrl);
            oldHandle.componentRef.destroy();

            config.handles.delete(oldestUrl);
        }
        config.handles.set(storeKey, handle);
        config.handleKeys.push(storeKey);
    }

    /** Determines if this route (and its subtree) should be reattached */
    public shouldAttach(route: ActivatedRouteSnapshot): boolean {
        if (route.routeConfig) {
            const config = routes[getConfiguredUrl(route)];

            if (config) {
                const storeKey = getStoreKey(route);
                return config.handles.has(storeKey);
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
                return config.handles.get(storeKey);
            }
        }

        return null;
    }

    /** Determines if `curr` route should be reused */
    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        const ours = Object.keys(routes);
        const c = getConfiguredUrl(curr);
        const f = getConfiguredUrl(future);

        // The routes managed by this class should never use the implicit reuse mechanism of Angular,
        // even when going from /collection/1 to /collection/2. But instead they will always use this class mechanism.
        if (ours.includes(c) || ours.includes(f)) {
            return false;
        }

        return future.routeConfig === curr.routeConfig;
    }

    public clearDetachedRoutes(): void {
        Object.keys(routes).forEach(routeName => {
            routes[routeName].handleKeys.length = 0;

            routes[routeName].handles.forEach((handle, handleName) => {
                handle.componentRef.destroy();
                routes[routeName].handles.delete(handleName);
            });
        });
    }
}

import {ComponentRef} from '@angular/core';
import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

// Sources
// https://github.com/angular/angular/issues/13869#issuecomment-441054267
// https://stackoverflow.com/questions/41280471/how-to-implement-routereusestrategy-shoulddetach-for-specific-routes-in-angular#answer-41515648

/**
 * Flag to preserve if we are going from or going to a detail page. If neither is a detail page, we can clear reuse cache.
 */
let clearRoutes = false;

/**
 * List of routes that cache their state for further reuse
 */
const routes: Readonly<Record<string, RouteStates>> = {
    '/home': {handles: new Map()},
    '/collection/:collectionId': {handles: new Map()},
    '/my-collection/unclassified': {handles: new Map()},
    '/my-collection/my-cards': {handles: new Map()},
    '/my-collection/my-collection': {handles: new Map()},
    '/source': {handles: new Map()},
    '/collection': {handles: new Map()},
};

interface RouteStates {
    readonly handles: Map<string, DetachedRouteHandle & {componentRef?: ComponentRef<unknown>}>;
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

    // This works, as ActivatedRouteSnapshot has only every one children ActivatedRouteSnapshot
    // as you can't have more since urls like `/project/1,2` where you'd want to display 1 and 2 project at the
    // same time
    const childrenParts = [];
    let deepestChild = route;
    while (deepestChild.firstChild) {
        deepestChild = deepestChild.firstChild;
        childrenParts.push(deepestChild.url.join('/'));
    }

    // It's important to separate baseUrl with childrenParts, so we don't have collisions.
    return baseUrl + '////' + childrenParts.join('/');
}

export class AppRouteReuseStrategy implements RouteReuseStrategy {
    /**
     * Determines if the route should be reused as it is.
     * For example : when navigation to same route instruction with different parameters (like id).
     * Should return true if we stay on the same route, and false if we change route.
     * If returns false, the next functions are called :
     *  - first : shouldAttach for landing route/component
     *  - and then : shouldDetach for leaving component/route)
     */
    public shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
        // If we want to preserve routes with parameters, test by adding : && getResolvedUrl(future) === getResolvedUrl(curr)
        return future.routeConfig === current.routeConfig;
    }

    /**
     * Determines if this route (and its subtree) should be detached from actual router state and stored by us to be reused later
     * If return true, next function to be called is store()
     */
    public shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // If the leaved page is not detail (/card/:cardId), neither is the landing page (flaged previously),
        // we are out of scope of reuse, and we can clear all stored components to prevent leak
        if (clearRoutes && !this.isDetailPage(route)) {
            this.clearDetachedRoutes();
            clearRoutes = false;
        }

        return !!routes[getConfiguredUrl(route)];
    }

    /**
     * Persist the detached route following our own needs.
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

        config.handles.set(storeKey, handle);
    }

    /**
     * Determines if this route (and its subtree) should be reattached from our custom memory to angular actual router state
     * If returns true, the next function to be called is retrieve()
     */
    public shouldAttach(route: ActivatedRouteSnapshot): boolean {
        if (!route.routeConfig) {
            return false;
        }

        clearRoutes = !this.isDetailPage(route); // flag if landing page is not a detail

        const config = routes[getConfiguredUrl(route)];
        if (config) {
            const storeKey = getStoreKey(route);
            return config.handles.has(storeKey);
        }

        return false;
    }

    /**
     * Retrieves the previously stored route
     */
    public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        if (!route.routeConfig) {
            return null;
        }

        const config = routes[getConfiguredUrl(route)];
        if (config) {
            const storeKey = getStoreKey(route);
            return config.handles.get(storeKey);
        }

        return null;
    }

    public clearDetachedRoutes(): void {
        Object.keys(routes).forEach(routeName => {
            routes[routeName].handles.forEach((handle, handleName) => {
                handle.componentRef.destroy();
                routes[routeName].handles.delete(handleName);
            });
        });
    }

    /**
     * Returns true if given route matches with the card detail page
     */
    public isDetailPage(route: ActivatedRouteSnapshot): boolean {
        return route?.routeConfig && getConfiguredUrl(route) === '/card/:cardId';
    }
}

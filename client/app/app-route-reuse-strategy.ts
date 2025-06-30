import {ComponentRef} from '@angular/core';
import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

export enum RouteReuseStatus {
    default = 'default',
    stored = 'stored',
    retrieving = 'retrieving',
}

export type ReusableRouteStatus = {
    routeReuseStatus: RouteReuseStatus;
};

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

/**
 * This class only purpose is to be able to restore the scroll state of `ListComponent` when we come back
 * from the card detail page. There is no other use-cases.
 *
 * It **cannot** and it **must not** be used for any other components.
 */
export class AppRouteReuseStrategy implements RouteReuseStrategy {
    /**
     * List of routes of `ListComponent` that cache their state for further reuse
     */
    private readonly routes: Readonly<
        Record<string, Map<string, DetachedRouteHandle & {componentRef?: ComponentRef<unknown>}>>
    > = {
        '/home': new Map(),
        '/collection/:collectionId': new Map(),
        '/my-collection/unclassified': new Map(),
        '/my-collection/my-cards': new Map(),
        '/my-collection/my-collection': new Map(),
        '/source': new Map(),
        '/collection': new Map(),
    };

    /**
     * Flag to preserve if we are going from or going to a detail page. If neither is a detail page, we can clear reuse cache.
     */
    private clearRoutes = false;

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
        // If the leaved page is not detail (/card/:cardId), neither is the landing page (flagged previously),
        // we are out of scope of reuse, and we can clear all stored components to prevent leak
        if (this.clearRoutes && !this.isCardDetailPage(route)) {
            this.clearDetachedRoutes();
            this.clearRoutes = false;
        }

        return !!this.routes[getConfiguredUrl(route)];
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

        const handles = this.routes[getConfiguredUrl(route)];
        if (!handles) {
            return;
        }

        const storeKey = getStoreKey(route);
        if (handles.has(storeKey)) {
            return;
        }

        (
            handle as DetachedRouteHandle & {componentRef: ComponentRef<ReusableRouteStatus>}
        ).componentRef.instance.routeReuseStatus = RouteReuseStatus.stored;
        handles.set(storeKey, handle);
    }

    /**
     * Determines if this route (and its subtree) should be reattached from our custom memory to angular actual router state
     * If returns true, the next function to be called is retrieve()
     */
    public shouldAttach(route: ActivatedRouteSnapshot): boolean {
        if (!route.routeConfig) {
            return false;
        }

        this.clearRoutes = !this.isCardDetailPage(route); // flag if landing page is not a detail

        const handles = this.routes[getConfiguredUrl(route)];
        if (handles) {
            const storeKey = getStoreKey(route);
            return handles.has(storeKey);
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

        const handles = this.routes[getConfiguredUrl(route)];
        if (handles) {
            const storeKey = getStoreKey(route);
            const handle = handles.get(storeKey);
            (
                handle as DetachedRouteHandle & {componentRef: ComponentRef<ReusableRouteStatus>}
            ).componentRef.instance.routeReuseStatus = RouteReuseStatus.retrieving;
            return handle ?? null;
        }

        return null;
    }

    public clearDetachedRoutes(): void {
        Object.keys(this.routes).forEach(routeName => {
            this.routes[routeName].forEach((handle, handleName) => {
                handle.componentRef?.destroy();
                this.routes[routeName].delete(handleName);
            });
        });
    }

    /**
     * Returns true if given route matches with the card detail page
     */
    private isCardDetailPage(route: ActivatedRouteSnapshot): boolean {
        return !!route?.routeConfig && getConfiguredUrl(route) === '/card/:cardId';
    }
}

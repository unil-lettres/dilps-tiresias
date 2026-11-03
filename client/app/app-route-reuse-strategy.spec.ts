import {Component, type OnDestroy} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {provideRouter, RouteReuseStrategy, RouterOutlet, type Routes} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {AppRouteReuseStrategy, type ReusableRouteStatus, RouteReuseStatus} from './app-route-reuse-strategy';

/**
 * Stands for `ListComponent`, recording its instances to know whether it was reused
 */
@Component({selector: 'app-list-stub', template: 'list'})
class ListStubComponent implements ReusableRouteStatus, OnDestroy {
    public static instances: ListStubComponent[] = [];
    public routeReuseStatus = RouteReuseStatus.default;
    public destroyed = false;

    public constructor() {
        ListStubComponent.instances.push(this);
    }

    public ngOnDestroy(): void {
        this.destroyed = true;
    }
}

@Component({selector: 'app-outlet-stub', imports: [RouterOutlet], template: '<router-outlet />'})
class OutletStubComponent implements ReusableRouteStatus {
    public routeReuseStatus = RouteReuseStatus.default;
}

@Component({selector: 'app-card-stub', template: 'card'})
class CardStubComponent {}

/**
 * The same structure as the routes of the app, see app.routes.ts
 */
const routes: Routes = [
    {
        path: '',
        component: OutletStubComponent,
        children: [
            {path: 'home', component: ListStubComponent},
            {path: 'card/:cardId', component: CardStubComponent},
            {path: 'user', component: CardStubComponent},
            {
                path: 'collection',
                component: OutletStubComponent,
                children: [{path: ':collectionId', component: ListStubComponent}],
            },
            {
                path: 'source',
                component: OutletStubComponent,
                children: [{path: ':collectionId', component: ListStubComponent}],
            },
            {
                path: 'my-collection',
                component: OutletStubComponent,
                children: [
                    {path: 'unclassified', component: ListStubComponent},
                    {path: 'my-cards', component: ListStubComponent},
                    {path: ':collectionId', component: ListStubComponent},
                ],
            },
        ],
    },
];

describe('AppRouteReuseStrategy', () => {
    let harness: RouterTestingHarness;

    beforeEach(async () => {
        ListStubComponent.instances = [];
        TestBed.configureTestingModule({
            providers: [provideRouter(routes), {provide: RouteReuseStrategy, useClass: AppRouteReuseStrategy}],
        });
        harness = await RouterTestingHarness.create();
    });

    /**
     * Go to a card and come back, and tell whether the list was reused
     */
    async function isReusedAfterCard(url: string): Promise<boolean> {
        await harness.navigateByUrl(url);
        const list = ListStubComponent.instances.at(-1)!;

        await harness.navigateByUrl('/card/6000');
        await harness.navigateByUrl(url);

        return ListStubComponent.instances.at(-1) === list && list.routeReuseStatus === RouteReuseStatus.retrieving;
    }

    for (const url of [
        '/home',
        '/collection/2000',
        '/source/2000',
        '/my-collection/my-cards',
        '/my-collection/unclassified',
        '/my-collection/2000',
    ]) {
        it(`reuses the list of ${url} when coming back from a card`, async () => {
            expect(await isReusedAfterCard(url)).toBe(true);
        });
    }

    it('does not reuse a list of another collection', async () => {
        await harness.navigateByUrl('/collection/2000');
        const list = ListStubComponent.instances.at(-1);

        await harness.navigateByUrl('/card/6000');
        await harness.navigateByUrl('/collection/2001');

        expect(ListStubComponent.instances.at(-1)).not.toBe(list);
    });

    it('keeps the list shown when the stored lists are cleared, eg: after creating a collection', async () => {
        expect(await isReusedAfterCard('/home')).toBe(true);
        const list = ListStubComponent.instances.at(-1)!;

        (TestBed.inject(RouteReuseStrategy) as AppRouteReuseStrategy).clearDetachedRoutes();

        expect(list.destroyed).toBe(false);
        expect(await isReusedAfterCard('/home')).toBe(true);
        expect(ListStubComponent.instances.at(-1)).toBe(list);
    });

    it('destroys the lists that are not shown when the stored lists are cleared', async () => {
        await harness.navigateByUrl('/home');
        const list = ListStubComponent.instances.at(-1)!;
        await harness.navigateByUrl('/card/6000');

        (TestBed.inject(RouteReuseStrategy) as AppRouteReuseStrategy).clearDetachedRoutes();
        await harness.navigateByUrl('/home');

        expect(list.destroyed).toBe(true);
        expect(ListStubComponent.instances.at(-1)).not.toBe(list);
    });

    it('does not reuse a list once left for another page than a card', async () => {
        await harness.navigateByUrl('/home');
        const list = ListStubComponent.instances.at(-1);

        await harness.navigateByUrl('/user');
        await harness.navigateByUrl('/home');

        expect(ListStubComponent.instances.at(-1)).not.toBe(list);
    });
});

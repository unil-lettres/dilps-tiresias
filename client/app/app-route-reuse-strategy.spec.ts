import {Component} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {provideRouter, RouteReuseStrategy, RouterOutlet, type Routes} from '@angular/router';
import {RouterTestingHarness} from '@angular/router/testing';
import {AppRouteReuseStrategy, type ReusableRouteStatus, RouteReuseStatus} from './app-route-reuse-strategy';

/**
 * Stands for `ListComponent`, recording its instances to know whether it was reused
 */
@Component({selector: 'app-list-stub', template: 'list'})
class ListStubComponent implements ReusableRouteStatus {
    public static instances: ListStubComponent[] = [];
    public routeReuseStatus = RouteReuseStatus.default;

    public constructor() {
        ListStubComponent.instances.push(this);
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

    for (const url of ['/home', '/collection/2000', '/my-collection/my-cards', '/my-collection/unclassified']) {
        it(`reuses the list of ${url} when coming back from a card`, async () => {
            expect(await isReusedAfterCard(url)).toBe(true);
        });
    }

    // Known bug: the routes to reuse miss "/source/:collectionId", and have "/my-collection/my-collection" instead of
    // "/my-collection/:collectionId", so the lists of a fonds, and of a collection in "Mes collections", are created
    // again when coming back from a card, and lose their scroll position. Replace `it.fails` by `it` once fixed.
    for (const url of ['/source/2000', '/my-collection/2000']) {
        it.fails(`reuses the list of ${url} when coming back from a card`, async () => {
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

    it('does not reuse a list once left for another page than a card', async () => {
        await harness.navigateByUrl('/home');
        const list = ListStubComponent.instances.at(-1);

        await harness.navigateByUrl('/user');
        await harness.navigateByUrl('/home');

        expect(ListStubComponent.instances.at(-1)).not.toBe(list);
    });
});

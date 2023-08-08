import {Directive, Injectable, OnDestroy, OnInit} from '@angular/core';
import {MatTooltip} from '@angular/material/tooltip';
import {NavigationStart, Router} from '@angular/router';
import {filter} from 'rxjs';

@Injectable({
    providedIn: 'root',
})
class TooltipCollector {
    public readonly collection = new Set<MatTooltip>();

    public constructor(router: Router) {
        router.events.pipe(filter(e => e instanceof NavigationStart)).subscribe(() => {
            for (const tooltip of this.collection) {
                if (tooltip._isTooltipVisible()) {
                    tooltip._overlayRef?.detach();

                    // Only one can be visible at a time, but we don't know which one from the collection
                    break;
                }
            }
        });
    }
}

/**
 * This directive will hide tooltips that can get stuck when navigating away from a page while we use `RouteReuseStrategy`
 *
 * See https://github.com/angular/components/issues/11478
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[matTooltip]',
    standalone: true,
})
export class HideTooltipDirective implements OnInit, OnDestroy {
    public constructor(
        private readonly matToolTip: MatTooltip,
        private readonly tooltipCollector: TooltipCollector,
    ) {}

    public ngOnInit(): void {
        this.tooltipCollector.collection.add(this.matToolTip);
    }

    public ngOnDestroy(): void {
        this.tooltipCollector.collection.delete(this.matToolTip);
    }
}

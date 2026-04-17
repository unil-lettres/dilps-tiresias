import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {RouterLink} from '@angular/router';
import {NaturalIconDirective} from '@ecodev/natural';
import {BreadcrumbItem} from '../AbstractNavigableList';

@Component({
    selector: 'app-navigable-breadcrumb',
    imports: [MatButton, MatIcon, RouterLink, NaturalIconDirective],
    templateUrl: './navigable-breadcrumb.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigableBreadcrumbComponent {
    public readonly breadcrumbs = input.required<BreadcrumbItem[]>();
    public readonly rootLabel = input.required<string>();
    public readonly getLink = input.required<(item: BreadcrumbItem | null) => RouterLink['routerLink']>();

    protected linkForItem(item: BreadcrumbItem | null): RouterLink['routerLink'] {
        return this.getLink()(item);
    }
}

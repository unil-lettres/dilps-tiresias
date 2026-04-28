import {Component, computed, input} from '@angular/core';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
    selector: 'app-collection-hierarchy',
    imports: [MatTooltip],
    templateUrl: './collection-hierarchy.component.html',
    styleUrl: './collection-hierarchy.component.scss',
})
export class CollectionHierarchyComponent {
    public readonly collection = input.required<{name: string; hierarchicName: string}>();

    protected readonly parents = computed(() =>
        this.collection()
            .hierarchicName.split('>')
            .map(parent => parent.trim())
            .filter(parent => parent.length > 0),
    );

    protected readonly immediateAncestor = computed(() => {
        const parents = this.parents();
        return parents[parents.length - 2];
    });

    protected readonly lastAncestor = computed(() => this.parents()[0]);

    protected readonly tooltipContent = computed(() => {
        const parents = this.parents();
        return parents.slice(1, parents.length - 2).join(' > ');
    });
}

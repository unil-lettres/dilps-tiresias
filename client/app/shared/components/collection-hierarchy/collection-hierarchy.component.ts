import {Component, input, OnInit} from '@angular/core';
import {Collections} from '../../generated-types';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
    selector: 'app-collection-hierarchy',
    imports: [MatTooltip],
    templateUrl: './collection-hierarchy.component.html',
    styleUrl: './collection-hierarchy.component.scss',
})
export class CollectionHierarchyComponent implements OnInit {
    public readonly collection = input.required<Collections['collections']['items'][0]>();

    public parents: string[] = [];

    public ngOnInit(): void {
        this.parents = this.collection()
            .hierarchicName.split('>')
            .map(parent => parent.trim())
            .filter(parent => parent.length > 0);
    }

    public get immedateAncestor(): string {
        return this.parents[this.parents.length - 2];
    }

    public get lastAncestor(): string {
        return this.parents[0];
    }

    public get tooltipContent(): string {
        return this.parents.slice(1, this.parents.length - 2).join(' > ');
    }
}

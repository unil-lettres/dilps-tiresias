import {Component, Input, OnInit} from '@angular/core';
import {Collections} from '../../generated-types';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
    selector: 'app-collection-hierarchy',
    templateUrl: './collection-hierarchy.component.html',
    styleUrls: ['./collection-hierarchy.component.scss'],
    standalone: true,
    imports: [MatTooltipModule],
})
export class CollectionHierarchyComponent implements OnInit {
    @Input({required: true})
    public collection!: Collections['collections']['items'][0];

    public parents: string[] = [];

    public ngOnInit(): void {
        this.parents = this.collection.hierarchicName.split('>').map(parent => parent.trim());
    }

    public get immedateAncestor(): string {
        return this.parents[this.parents.length - 2];
    }

    public get lastAcestor(): string {
        return this.parents[0];
    }

    public get tooltipContent(): string {
        return this.parents.slice(1, this.parents.length - 2).join(' > ');
    }
}

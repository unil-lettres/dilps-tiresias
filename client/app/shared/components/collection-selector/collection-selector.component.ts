import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArtistComponent } from '../../../artists/artist/artist.component';
import { CollectionService } from '../../../collections/services/collection.service';

import { UserService } from '../../../users/services/user.service';
import { CollectionFilter, UserRole } from '../../generated-types';
import { AlertService } from '../alert/alert.service';

@Component({
    selector: 'app-collection-selector',
    templateUrl: './collection-selector.component.html',
    styleUrls: ['./collection-selector.component.scss'],
})
export class CollectionSelectorComponent implements OnInit {

    public listFilter: CollectionFilter;
    public collection;
    public image;
    public newCollection: any = {
        name: '',
        description: '',
        parent: null,
    };

    constructor(public collectionService: CollectionService,
                private dialogRef: MatDialogRef<ArtistComponent>,
                private userService: UserService,
                private alertService: AlertService,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {

        this.userService.getCurrentUser().subscribe(user => {
            if (user.role !== UserRole.administrator) {
                this.listFilter = {groups: [{conditions: [{creator: {equal: {value: user.id}}}]}]};
            }
        });

        if (this.data.images && this.data.images.length === 1) {
            this.image = this.data.images[0];
        }
    }

    public link(): void {
        this.linkInternal(this.collection);
    }

    public unlink(image, collection) {
        this.collectionService.unlink(collection, [image]).subscribe(() => {
            const index = image.collections.findIndex(c => c.id === collection.id);
            image.collections.splice(index, 1);
            this.alertService.info('Fiche retirée de la collection');
        });
    }

    public createAndLink(): void {
        this.collectionService.create(this.newCollection).subscribe(collection => {
            this.linkInternal(collection);
        });
    }

    private linkInternal(collection): void {
        let observable;
        if (this.data.images) {
            observable = this.collectionService.link(collection, this.data.images);
        } else {
            observable = this.collectionService.linkCollectionToCollection(this.data.collection, collection);
        }

        observable.subscribe(() => {
            if (this.data.images && this.data.images.length === 1 && this.data.images[0].collections) {
                this.data.images[0].collections.push(collection);
            }
            this.dialogRef.close(collection);
            this.alertService.info('Fiches ajoutées');
        });

    }
}

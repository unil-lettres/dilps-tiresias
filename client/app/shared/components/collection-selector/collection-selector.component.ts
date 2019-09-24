import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ArtistComponent } from '../../../artists/artist/artist.component';
import { CollectionService } from '../../../collections/services/collection.service';

import { UserService } from '../../../users/services/user.service';
import { UserRole } from '../../generated-types';
import { Literal } from '../../types';
import { AlertService } from '../alert/alert.service';

@Component({
    selector: 'app-collection-selector',
    templateUrl: './collection-selector.component.html',
    styleUrls: ['./collection-selector.component.scss'],
})
export class CollectionSelectorComponent implements OnInit {

    public listFilters: Literal;
    public collection;
    public image;
    public newCollection: any = {
        name: '',
        description: '',
        parent: null,
    };

    constructor(public collectionSvc: CollectionService,
                private dialogRef: MatDialogRef<ArtistComponent>,
                private userSvc: UserService,
                private alertSvc: AlertService,
                @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {

        this.userSvc.getCurrentUser().subscribe(user => {
            if (user.role !== UserRole.administrator) {
                this.listFilters = {creators: [user.id]};
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
        this.collectionSvc.unlink(collection, [image]).subscribe(() => {
            const index = image.collections.findIndex(c => c.id === collection.id);
            image.collections.splice(index, 1);
            this.alertSvc.info('Fiche retirée de la collection');
        });
    }

    public createAndLink(): void {
        this.collectionSvc.create(this.newCollection).subscribe(collection => {
            this.linkInternal(collection);
        });
    }

    private linkInternal(collection): void {
        let observable;
        if (this.data.images) {
            observable = this.collectionSvc.link(collection, this.data.images);
        } else {
            observable = this.collectionSvc.linkCollectionToCollection(this.data.collection, collection);
        }

        observable.subscribe(() => {
            if (this.data.images && this.data.images.length === 1 && this.data.images[0].collections) {
                this.data.images[0].collections.push(collection);
            }
            this.dialogRef.close(collection);
            this.alertSvc.info('Fiches ajoutées');
        });

    }
}

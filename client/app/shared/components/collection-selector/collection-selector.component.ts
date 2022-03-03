import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CollectionService} from '../../../collections/services/collection.service';
import {UserService} from '../../../users/services/user.service';
import {
    Cards_cards_items,
    Cards_cards_items_collections,
    CollectionFilter,
    Collections_collections_items,
    CreateCollection_createCollection,
    LogicalOperator,
    UserRole,
} from '../../generated-types';
import {AlertService} from '../alert/alert.service';
import {FakeCollection} from '../../../collections/services/fake-collection.resolver';

/**
 * Exclusive fields:
 * If `images` is given will link all images to the selected collection.
 * If `collection` is given will link the collection's images to the selected collection.
 * If nothing is given will do nothing and return the selected collection.
 */
export type CollectionSelectorData =
    | {
          images: Cards_cards_items[];
          collection?: never;
      }
    | {
          images?: never;
          collection: FakeCollection;
      }
    | {
          images?: never;
          collection?: never;
      };

export type CollectionSelectorResult = Collections_collections_items | CreateCollection_createCollection;

@Component({
    selector: 'app-collection-selector',
    templateUrl: './collection-selector.component.html',
    styleUrls: ['./collection-selector.component.scss'],
})
export class CollectionSelectorComponent implements OnInit {
    public listFilter: CollectionFilter;
    public collection: Collections_collections_items;
    public image: Cards_cards_items | undefined;
    public newCollection: any = {
        name: '',
        description: '',
        parent: null,
    };

    public constructor(
        public readonly collectionService: CollectionService,
        private readonly dialogRef: MatDialogRef<CollectionSelectorComponent, CollectionSelectorResult>,
        private readonly userService: UserService,
        private readonly alertService: AlertService,
        @Inject(MAT_DIALOG_DATA) public readonly data: CollectionSelectorData,
    ) {}

    public ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            if (![UserRole.administrator, UserRole.major].includes(user.role)) {
                this.listFilter = {
                    groups: [
                        {conditions: [{owner: {equal: {value: user.id}}}]},
                        {
                            groupLogic: LogicalOperator.OR,
                            conditions: [{users: {have: {values: [user.id]}}}],
                        },
                    ],
                };
            }
        });

        if (this.data.images && this.data.images.length === 1) {
            this.image = this.data.images[0];
        }
    }

    public link(): void {
        this.linkInternal(this.collection);
    }

    public unlink(image: Cards_cards_items, collection: Cards_cards_items_collections): void {
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

    private linkInternal(collection: Collections_collections_items | CreateCollection_createCollection): void {
        let observable;
        if (this.data.images) {
            observable = this.collectionService.link(collection, this.data.images);
        } else if (this.data.collection) {
            observable = this.collectionService.linkCollectionToCollection(this.data.collection, collection);
        } else {
            this.dialogRef.close(collection);

            return;
        }

        observable.subscribe(() => {
            if (this.data.images && this.data.images.length === 1 && this.data.images[0].collections) {
                this.data.images[0].collections.push(collection as any);
            }
            this.dialogRef.close(collection);
            this.alertService.info('Fiches ajoutées');
        });
    }
}

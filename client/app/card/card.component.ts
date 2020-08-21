import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {NgModel} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {findKey, merge, sortBy, omit} from 'lodash';
import {QuillModules} from 'ngx-quill';
import {AntiqueNameComponent} from '../antique-names/antique-name/antique-name.component';
import {AntiqueNameService} from '../antique-names/services/antique-name.service';
import {ArtistComponent} from '../artists/artist/artist.component';
import {ArtistService} from '../artists/services/artist.service';
import {ChangeService} from '../changes/services/change.service';
import {DocumentTypeComponent} from '../document-types/document-type/document-type.component';
import {DocumentTypeService} from '../document-types/services/document-type.service';
import {DomainComponent} from '../domains/domain/domain.component';
import {DomainService} from '../domains/services/domain.service';
import {InstitutionComponent} from '../institutions/institution/institution.component';
import {InstitutionService} from '../institutions/services/institution.service';
import {MaterialComponent} from '../materials/material/material.component';
import {MaterialService} from '../materials/services/material.service';
import {PeriodComponent} from '../periods/period/period.component';
import {PeriodService} from '../periods/services/period.service';
import {AlertService} from '../shared/components/alert/alert.service';
import {CardSelectorComponent} from '../shared/components/card-selector/card-selector.component';
import {
    CollectionSelectorComponent,
    CollectionSelectorData,
    CollectionSelectorResult,
} from '../shared/components/collection-selector/collection-selector.component';
import {DownloadComponent} from '../shared/components/download/download.component';
import {quillConfig} from '../shared/config/quill.options';
import {
    Card_card,
    Card_card_artists,
    Card_card_collections,
    Card_card_institution,
    CardInput,
    Cards_cards_items,
    CardVisibility,
    CollectionVisibility,
    Site,
    UpdateCard_updateCard_artists,
    UpdateCard_updateCard_institution,
    UserRole,
    Viewer,
} from '../shared/generated-types';
import {domainHierarchicConfig} from '../shared/hierarchic-configurations/DomainConfiguration';
import {onlyLeafMaterialHierarchicConfig} from '../shared/hierarchic-configurations/MaterialConfiguration';
import {periodHierarchicConfig} from '../shared/hierarchic-configurations/PeriodConfiguration';
import {onlyLeafTagHierarchicConfig} from '../shared/hierarchic-configurations/TagConfiguration';
import {onlyLeaves} from '../shared/pipes/only-leaves.pipe';
import {UploadService} from '../shared/services/upload.service';
import {getBase64} from '../shared/services/utility';
import {StatisticService} from '../statistics/services/statistic.service';
import {TagService} from '../tags/services/tag.service';
import {TagComponent} from '../tags/tag/tag.component';
import {UserService} from '../users/services/user.service';
import {CardService} from './services/card.service';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    providers: [UploadService],
})
export class CardComponent implements OnInit, OnChanges, OnDestroy {
    /**
     * External card data
     */
    @Input() public model: CardInput;

    /**
     * The card as fetched from DB, if applicable.
     *
     * eg: it will be null if we are creating a new card, creating suggestion or mass editing
     */
    public fetchedModel: Card_card | null = null;

    /**
     * For mass edit usage, reference should be hidden/ignored because it is a unique field, and incompatible with mass edit
     */
    @Input() public hideCode = false;

    /**
     * Show/Hide toolbar
     */
    @Input() public hideToolbar = false;

    /**
     * Show/Hide the right side of the card (image and actions in toolbar)
     */
    @Input() public hideImage = false;

    /**
     * Hide related cards
     */
    @Input() public hideCards = false;

    /**
     * Hide some toolbar actions
     */
    @Input() public hideTools = false;

    /**
     * Show a string on the right of the logo, for "human" contextualisation purposes, like informing if car is source or surggestion
     */
    @Input() public title: string;

    /**
     * Show logo on top of the page if true
     */
    @Input() public showLogo = false;

    /**
     * Base 64 image data for display usage before effective upload
     */
    @Input() public imageData: string;

    /**
     * Url of resized images (2000px) to be displayed
     */
    @Input() public imageSrc: string;

    /**
     * Url of full sized image (for download purpose)
     */
    @Input() public imageSrcFull: string;

    /**
     * Default visibility
     */
    public visibility = 1;

    /**
     * List of visibilities
     */
    public visibilities = {
        1: {
            value: CardVisibility.private,
            text: 'par moi, les admins et les abonnés',
            color: null,
        },
        2: {
            value: CardVisibility.member,
            text: 'par les membres',
            color: 'accent',
        },
        3: {
            value: CardVisibility.public,
            text: 'par tous',
            color: 'primary',
        },
    };

    /**
     * Currently logged user
     */
    public user: Viewer['viewer'];

    public singleLine: QuillModules = {
        ...quillConfig.modules,
        keyboard: {
            bindings: {
                enter: {
                    key: 13,
                    handler: () => false,
                },
                shiftEnter: {
                    key: 13,
                    shiftKey: true,
                    handler: () => false,
                },
            },
        },
    };

    /**
     * Cache institution data from server
     * this.model is here considered as CardInput and should receive string, not object
     */
    public institution: Card_card_institution | UpdateCard_updateCard_institution | null;

    /**
     * Cache artists data from server
     * this.model is here considered as CardInput and should receive string array, not array of objects
     */
    public artists: Card_card_artists[] | UpdateCard_updateCard_artists[] = [];

    /**
     * Template exposed variable
     */
    public InstitutionComponent = InstitutionComponent;

    /**
     * Template exposed variable
     */
    public ArtistComponent = ArtistComponent;

    /**
     * Template exposed variable
     */
    public MaterialComponent = MaterialComponent;
    /**
     * Template exposed variable
     */
    public PeriodComponent = PeriodComponent;

    /**
     * Template exposed variable
     */
    public TagComponent = TagComponent;

    /**
     * Template exposed variable
     */
    public DocumentTypeComponent = DocumentTypeComponent;

    /**
     * Template exposed variable
     */
    public DomainComponent = DomainComponent;

    /**
     * Template exposed variable
     */
    public AntiqueNameComponent = AntiqueNameComponent;

    /**
     * Template exposed variable
     */
    public domainHierarchicConfig = domainHierarchicConfig;

    /**
     * Template exposed variable
     */
    public tagHierarchicConfig = onlyLeafTagHierarchicConfig;

    /**
     * Template exposed variable
     */
    public periodHierarchicConfig = periodHierarchicConfig;

    /**
     * Template exposed variable
     */
    public materialHierarchicConfig = onlyLeafMaterialHierarchicConfig;

    /**
     * Edition mode if true
     */
    public edit = false;

    /**
     * Cache for upload subscription
     * Usefull for (de)activation toggle
     */
    private uploadSub;

    /**
     * Sorted list collections by their hierarchicNames
     */
    public sortedCollections: Card_card_collections[] = [];

    public formIsValid = true;
    public codeModel: NgModel | null;
    public urlModel: NgModel | null;
    public collectionCopyrights = '';
    public isDilps = true;
    public suggestedCode: string | null;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private changeService: ChangeService,
        public cardService: CardService,
        private alertService: AlertService,
        public artistService: ArtistService,
        public institutionService: InstitutionService,
        public materialService: MaterialService,
        public tagService: TagService,
        public documentTypeService: DocumentTypeService,
        public domainService: DomainService,
        public antiqueNameService: AntiqueNameService,
        public periodService: PeriodService,
        private uploadService: UploadService,
        private dialog: MatDialog,
        private userService: UserService,
        private statisticService: StatisticService,
    ) {}

    @Input()
    set editable(val: boolean) {
        this.edit = val;
        this.updateUploadWatching();
    }

    public updateFormValidity(): void {
        this.formIsValid = (!this.urlModel || this.urlModel.valid) && (!this.codeModel || this.codeModel.valid);
    }

    public ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            this.user = user;
        });

        this.route.data.subscribe(data => (this.showLogo = data.showLogo));

        if (this.model && !this.isFetchedCard(this.model)) {
            // mass edit and create a change case
            this.initCard();
            this.edit = true;
        } else if (this.model && this.isFetchedCard(this.model)) {
            this.fetchedModel = this.model;
            this.initCard();
        } else {
            this.route.params.subscribe(params => {
                if (params.cardId) {
                    this.fetchedModel = this.route.snapshot.data.card;

                    this.model = Object.assign({}, this.fetchedModel, {
                        artists: this.fetchedModel.artists.map(a => a.name),
                        institution: this.fetchedModel.institution?.name ?? null,
                    });

                    this.initCard();
                } else if (!params.cardId && this.model && this.isFetchedCard(this.model)) {
                    this.fetchedModel = this.model;
                    this.initCard();
                }
            });
        }

        this.updateUploadWatching();
        this.statisticService.recordDetail();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.initCard();
    }

    public ngOnDestroy(): void {
        this.unwatchUpload();
    }

    public toggleEdit(): void {
        this.edit = !this.edit;
        this.updateUploadWatching();
    }

    public updateUploadWatching(): void {
        if (this.edit) {
            this.watchUpload();
        } else {
            this.unwatchUpload();
        }
    }

    public watchUpload(): void {
        this.uploadSub = this.uploadService.filesChanged.subscribe(files => {
            const file = files[files.length - 1];
            this.model.file = file;
            this.getBase64(file);
        });
    }

    public unwatchUpload(): void {
        if (this.uploadSub) {
            this.uploadSub.unsubscribe();
            this.uploadSub = null;
        }
    }

    public initCard(): void {
        if (this.model) {
            this.isDilps = this.model.site === Site.dilps;

            // Init visibility
            this.visibility = +findKey(this.visibilities, s => {
                return s.value === this.model.visibility;
            });

            this.institution = this.fetchedModel?.institution ?? null; // cache, see attribute docs
            this.artists = this.fetchedModel?.artists ?? null; // cache, see attribute docs

            const src = CardService.getImageLink(this.model, 2000);
            if (src) {
                this.imageSrc = src;
            }

            const srcFull = CardService.getImageLink(this.model, null);
            if (srcFull) {
                this.imageSrcFull = srcFull;
            }

            this.updateCollections();

            this.model.tags = onlyLeaves(this.model.tags);
            this.model.materials = onlyLeaves(this.model.materials);
        }
    }

    private updateCollections(): void {
        if (!this.fetchedModel) {
            return;
        }

        const visibleCollections = this.fetchedModel.collections.filter(
            c => c.visibility !== CollectionVisibility.private,
        );
        this.sortedCollections = sortBy(visibleCollections, 'hierarchicName');
        this.collectionCopyrights = this.fetchedModel.collections
            .filter(c => c.isSource)
            .map(c => {
                if (c.copyrights && c.usageRights) {
                    return `${c.copyrights} (${c.usageRights})`;
                } else if (c.copyrights) {
                    return c.copyrights;
                } else {
                    return c.usageRights;
                }
            })
            .join(', ');

        if (this.fetchedModel.collections.length === 1 && this.fetchedModel.id) {
            const idForCode = this.fetchedModel.legacyId ?? this.fetchedModel.id;
            this.suggestedCode = this.fetchedModel.collections[0].name + '-' + idForCode;
        } else {
            this.suggestedCode = null;
        }
    }

    public canUpdateCode(): boolean {
        return [UserRole.major, UserRole.administrator].includes(this.user.role);
    }

    public showSuggestedCode(): boolean {
        return this.edit && this.canUpdateCode() && this.suggestedCode && this.suggestedCode !== this.model.code;
    }

    public updateVisibility(ev): void {
        this.model.visibility = this.visibilities[ev.value].value;
    }

    public onSubmit(): void {
        if (this.isFetchedCard(this.model)) {
            this.update();
        } else {
            this.create();
        }
    }

    public update(): void {
        this.cardService.updateNow(this.model).subscribe(card => {
            this.alertService.info('Mis à jour');
            this.institution = card.institution;
            this.artists = card.artists;
            this.edit = false;
        });
    }

    public create(): void {
        this.cardService.create(this.model).subscribe(card => {
            this.alertService.info('Créé');
            this.router.navigate(['..', card.id], {relativeTo: this.route});
        });
    }

    public confirmDelete(): void {
        this.alertService
            .confirm('Suppression', 'Voulez-vous supprimer définitivement cet élément ?', 'Supprimer définitivement')
            .subscribe(confirmed => {
                this.assertFetchedCard(this.fetchedModel);

                if (confirmed) {
                    this.cardService.delete([this.fetchedModel]).subscribe(() => {
                        this.alertService.info('Supprimé');
                        this.router.navigateByUrl('/');
                    });
                }
            });
    }

    public suggestUpdate(): void {
        this.assertFetchedCard(this.fetchedModel);
        this.router.navigateByUrl('notification/new/' + this.fetchedModel.id);
    }

    public suggestDeletion(): void {
        this.assertFetchedCard(this.fetchedModel);
        this.changeService.suggestDeletion(this.fetchedModel).subscribe(() => {
            this.router.navigateByUrl('notification');
        });
    }

    public suggestCreation(): void {
        this.assertFetchedCard(this.fetchedModel);
        this.changeService.suggestCreation(this.fetchedModel).subscribe(() => {
            this.router.navigateByUrl('notification');
        });
    }

    public linkToCollection(): void {
        this.assertFetchedCard(this.fetchedModel);

        this.dialog
            .open<CollectionSelectorComponent, CollectionSelectorData, CollectionSelectorResult>(
                CollectionSelectorComponent,
                {
                    width: '400px',
                    position: {
                        top: '74px',
                        left: '74px',
                    },
                    data: {
                        images: [this.fetchedModel],
                    },
                },
            )
            .afterClosed()
            .subscribe(() => {
                this.assertFetchedCard(this.fetchedModel);

                this.cardService.getOne(this.fetchedModel.id).subscribe(result => {
                    this.assertFetchedCard(this.fetchedModel);

                    this.fetchedModel.collections = result.collections;
                    this.updateCollections();
                });
            });
    }

    public copy(): void {
        this.assertFetchedCard(this.fetchedModel);
        this.router.navigate(['/card/new', {cardId: this.fetchedModel.id}]);
    }

    public complete(): void {
        this.dialog
            .open<CardSelectorComponent, never, Cards_cards_items>(CardSelectorComponent, {
                width: '400px',
                position: {
                    top: '74px',
                    left: '74px',
                },
            })
            .afterClosed()
            .subscribe(selection => {
                this.assertFetchedCard(this.fetchedModel);

                if (selection) {
                    this.model = Object.assign(omit(selection, 'id'), {
                        artists: selection.artists.map(a => a.name),
                        institution: selection.institution?.name ?? null,
                        visibility: this.model.visibility,
                    });

                    this.fetchedModel = Object.assign({}, selection, {
                        id: this.fetchedModel.id,
                        visibility: this.model.visibility,
                    });

                    this.initCard();
                }
            });
    }

    public validateData(): void {
        this.assertFetchedCard(this.fetchedModel);
        this.cardService.validateData(this.fetchedModel).subscribe(() => {
            this.alertService.info('Donnée validée');
        });
    }

    public validateImage(): void {
        this.assertFetchedCard(this.fetchedModel);
        this.cardService.validateImage(this.fetchedModel).subscribe(() => {
            this.alertService.info('Image validée');
        });
    }

    public download(card): void {
        this.dialog.open(DownloadComponent, {
            width: '600px',
            data: {
                images: [card],
                denyLegendsDownload: !this.user,
            },
        });
    }

    public getSuggestAddLabel(): string {
        if (this.user.role === UserRole.junior || this.user.role === UserRole.senior) {
            return 'Soumettre';
        }

        return 'Suggérer l\'ajout';
    }

    public canSuggestCreate(): boolean {
        return (
            this.user &&
            this.fetchedModel &&
            this.fetchedModel.owner &&
            this.fetchedModel.owner.id === this.user.id &&
            this.fetchedModel.creator &&
            this.fetchedModel.creator.id === this.user.id &&
            this.fetchedModel.visibility === CardVisibility.private
        );
    }

    public canSuggestUpdate(): boolean {
        return (
            this.user &&
            this.fetchedModel &&
            ((this.fetchedModel.owner && this.user.id !== this.fetchedModel.owner.id) ||
                this.fetchedModel.visibility !== CardVisibility.private)
        );
    }

    public canSuggestDelete(): boolean {
        return this.canSuggestUpdate();
    }

    private getBase64(file): void {
        getBase64(file).then(result => {
            this.imageData = result;
        });
    }

    public displayWith(item): string {
        // Turn HTML to plain text
        return item ? item.name.replace(/<[^>]*>/g, '') + ' (' + item.id + ')' : '';
    }

    public useSuggestedCode(event: Event): void {
        event.preventDefault();
        this.model.code = this.suggestedCode;

        // Very short delay before validating to allow propagation of our changes
        setTimeout(() => {
            this.updateFormValidity();
        }, 1);
    }

    private isFetchedCard(card: Card_card | CardInput): card is Card_card {
        return '__typename' in card;
    }

    private assertFetchedCard(card: Card_card | null): asserts card is Card_card {
        if (!card) {
            throw new Error(
                'This should only be called with card fetched from DB. There is a logic error that allow user to try to do something that is impossible. A button should be hidden ?',
            );
        }
    }
}

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { findKey, merge, sortBy } from 'lodash';
import { QuillModules } from 'ngx-quill';
import { AntiqueNameComponent } from '../antique-names/antique-name/antique-name.component';
import { AntiqueNameService } from '../antique-names/services/antique-name.service';
import { ArtistComponent } from '../artists/artist/artist.component';
import { ArtistService } from '../artists/services/artist.service';
import { ChangeService } from '../changes/services/change.service';
import { DocumentTypeComponent } from '../document-types/document-type/document-type.component';
import { DocumentTypeService } from '../document-types/services/document-type.service';
import { DomainComponent } from '../domains/domain/domain.component';
import { DomainService } from '../domains/services/domain.service';
import { InstitutionComponent } from '../institutions/institution/institution.component';
import { InstitutionService } from '../institutions/services/institution.service';
import { MaterialComponent } from '../materials/material/material.component';
import { MaterialService } from '../materials/services/material.service';
import { PeriodComponent } from '../periods/period/period.component';
import { PeriodService } from '../periods/services/period.service';
import { AlertService } from '../shared/components/alert/alert.service';
import { CardSelectorComponent } from '../shared/components/card-selector/card-selector.component';
import {
    CollectionSelectorComponent,
    CollectionSelectorData,
    CollectionSelectorResult,
} from '../shared/components/collection-selector/collection-selector.component';
import { DownloadComponent } from '../shared/components/download/download.component';
import { quillConfig } from '../shared/config/quill.options';
import {
    Card_card,
    Card_card_artists,
    Card_card_collections,
    Card_card_institution,
    CardVisibility,
    Site,
    UpdateCard_updateCard_artists,
    UpdateCard_updateCard_institution,
    UserRole,
} from '../shared/generated-types';
import { domainHierarchicConfig } from '../shared/hierarchic-configurations/DomainConfiguration';
import { onlyLeafMaterialHierarchicConfig } from '../shared/hierarchic-configurations/MaterialConfiguration';
import { periodHierarchicConfig } from '../shared/hierarchic-configurations/PeriodConfiguration';
import { onlyLeafTagHierarchicConfig } from '../shared/hierarchic-configurations/TagConfiguration';
import { UploadService } from '../shared/services/upload.service';
import { getBase64 } from '../shared/services/utility';
import { StatisticService } from '../statistics/services/statistic.service';
import { TagService } from '../tags/services/tag.service';
import { TagComponent } from '../tags/tag/tag.component';
import { UserService } from '../users/services/user.service';
import { CardService } from './services/card.service';
import { NgModel } from '@angular/forms';
import { onlyLeaves } from '../shared/pipes/only-leaves.pipe';

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
    @Input() public model: Card_card & { artists: string[]; file: any; institution: string };

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
            text: 'par moi et les responsables des collections',
            color: null,
        },
        2: {
            value: CardVisibility.member,
            text: 'par tous les membres',
            color: 'accent',
        },
        3: {
            value: CardVisibility.public,
            text: 'par tout le monde',
            color: 'primary',
        },
    };

    /**
     * Currently logged user
     */
    public user;

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
    private edit = false;

    /**
     * Cache for upload subscription
     * Usefull for (de)activation toggle
     */
    private uploadSub;

    /**
     * Sorted list collections by their hierarchicNames
     */
    private sortedCollections: Card_card_collections[] = [];

    public formIsValid = true;
    public codeModel: NgModel | null;
    public urlModel: NgModel | null;
    private collectionCopyrights = '';
    public isDilps = true;

    constructor(private route: ActivatedRoute,
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
    ) {
    }

    @Input()
    set editable(val: boolean) {
        this.edit = val;
        this.updateUploadWatching();
    }

    public updateFormValidity(): void {
        this.formIsValid = (!this.urlModel || this.urlModel.valid) && (!this.codeModel || this.codeModel.valid);
    }

    ngOnInit() {

        this.userService.getCurrentUser().subscribe(user => {
            this.user = user;
        });

        this.route.data.subscribe(data => this.showLogo = data.showLogo);

        if (this.model && !this.model.id) {
            // mass edit and create a change case
            this.initCard();
            this.edit = true;

        } else if (this.model && this.model.id) {
            this.initCard();

        } else {
            this.route.params.subscribe(params => {
                if (params.cardId) {
                    const card = this.route.snapshot.data['card'];
                    this.model = merge({}, card);
                    this.initCard();
                } else if (!params.cardId && this.model && this.model.id) {
                    this.initCard();
                }
            });
        }

        this.updateUploadWatching();
        this.statisticService.recordDetail();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initCard();
    }

    ngOnDestroy() {
        this.unwatchUpload();
    }

    public toggleEdit() {
        this.edit = !this.edit;
        this.updateUploadWatching();
    }

    public updateUploadWatching() {
        if (this.edit) {
            this.watchUpload();
        } else {
            this.unwatchUpload();
        }
    }

    public watchUpload() {
        this.uploadSub = this.uploadService.filesChanged.subscribe(files => {
            const file = files[files.length - 1];
            this.model.file = file;
            this.getBase64(file);
        });
    }

    public unwatchUpload() {
        if (this.uploadSub) {
            this.uploadSub.unsubscribe();
            this.uploadSub = null;
        }
    }

    public initCard() {
        if (this.model) {
            this.isDilps = this.model.site === Site.dilps;

            // Init visibility
            this.visibility = +findKey(this.visibilities, (s) => {
                return s.value === this.model.visibility;
            });

            this.institution = this.model.institution; // cache, see attribute docs
            this.artists = this.model.artists; // cache, see attribute docs

            const src = CardService.getImageLink(this.model, 2000);
            if (src) {
                this.imageSrc = src;
            }

            const srcFull = CardService.getImageLink(this.model, null);
            if (srcFull) {
                this.imageSrcFull = srcFull;
            }

            if (this.model.collections) {
                this.sortedCollections = sortBy(this.model.collections, 'hierarchicName');
            }

            this.model.tags = onlyLeaves(this.model.tags);
            this.model.materials = onlyLeaves(this.model.materials);

            this.collectionCopyrights = this.model.collections.filter(c => c.isSource).map(c => {
                if (c.copyrights && c.usageRights) {
                    return `${c.copyrights} (${c.usageRights})`;
                } else if (c.copyrights) {
                    return c.copyrights;
                } else {
                    return c.usageRights;
                }
            }).join(', ');
        }
    }

    public updateVisibility(ev) {
        this.model.visibility = this.visibilities[ev.value].value;
    }

    public onSubmit() {
        if (this.model.id) {
            this.update();
        } else {
            this.create();
        }
    }

    public update() {
        this.cardService.updateNow(this.model).subscribe(card => {
            this.alertService.info('Mis à jour');
            this.institution = card.institution;
            this.artists = card.artists;
            this.edit = false;
        });
    }

    public create() {
        this.cardService.create(this.model).subscribe(card => {
            this.alertService.info('Créé');
            this.router.navigate([
                '..',
                card.id,
            ], {relativeTo: this.route});
        });
    }

    public confirmDelete() {
        this.alertService.confirm('Suppression', 'Voulez-vous supprimer définitivement cet élément ?', 'Supprimer définitivement')
            .subscribe(confirmed => {
                if (confirmed) {
                    this.cardService.delete([this.model]).subscribe(() => {
                        this.alertService.info('Supprimé');
                        this.router.navigateByUrl('/');
                    });
                }
            });
    }

    public suggestUpdate() {
        this.router.navigateByUrl('notification/new/' + this.model.id);
    }

    public suggestDeletion() {
        this.changeService.suggestDeletion(this.model).subscribe(() => {
            this.router.navigateByUrl('notification');
        });
    }

    public suggestCreation() {
        this.changeService.suggestCreation(this.model).subscribe(() => {
            this.router.navigateByUrl('notification');
        });
    }

    public linkToCollection() {

        this.dialog.open<CollectionSelectorComponent, CollectionSelectorData, CollectionSelectorResult>(CollectionSelectorComponent, {
            width: '400px',
            position: {
                top: '74px',
                left: '74px',
            },
            data: {
                images: [this.model],
            },
        });
    }

    public copy() {
        this.router.navigate(['/card/new', {cardId: this.model.id}]);
    }

    public complete() {

        this.dialog.open(CardSelectorComponent, {
            width: '400px',
            position: {
                top: '74px',
                left: '74px',
            },
        }).afterClosed().subscribe(selection => {
            if (selection) {
                this.model = Object.assign(selection, {id: this.model.id, visibility: this.model.visibility});
                this.initCard();
            }
        });
    }

    public validateData() {
        this.cardService.validateData(this.model).subscribe(() => {
            this.alertService.info('Donnée validée');
        });
    }

    public validateImage() {
        this.cardService.validateImage(this.model).subscribe(() => {
            this.alertService.info('Image validée');
        });
    }

    public download(card) {
        this.dialog.open(DownloadComponent, {
            width: '600px',
            data: {
                images: [card],
                denyLegendsDownload: !this.user,
            },
        });
    }

    public getSuggestAddLabel() {
        if (this.user.role === UserRole.junior || this.user.role === UserRole.senior) {
            return 'Soumettre';
        }

        return 'Suggérer l\'ajout';
    }

    public canSuggestCreate() {
        return this.user
            && this.model.owner && this.model.owner.id === this.user.id
            && this.model.creator && this.model.creator.id === this.user.id
            && this.model.visibility === CardVisibility.private;
    }

    public canSuggestUpdate() {
        return this.user && this.model.owner && this.user.id !== this.model.owner.id || this.model.visibility !== CardVisibility.private;
    }

    public canSuggestDelete() {
        return this.canSuggestUpdate();
    }

    private getBase64(file) {
        getBase64(file).then(result => {
            this.imageData = result;
        });
    }

    public displayWith(item) {
        return item ? item.name + ' (' + item.id + ')' : '';
    }
}

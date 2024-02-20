import {CdkAccordionItem, CdkAccordionModule} from '@angular/cdk/accordion';
import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {NgModel, FormsModule} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Data, Router} from '@angular/router';
import {findKey, sortBy, identity} from 'lodash-es';
import {QuillModules, QuillEditorComponent} from 'ngx-quill';
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
import {quillConfig} from '../shared/config/quill.options';
import {
    Card,
    CardInput,
    Cards,
    CardVisibility,
    CollectionVisibility,
    Site,
    UpdateCard,
    UserRole,
    Viewer,
    InputMaybe,
} from '../shared/generated-types';
import {domainHierarchicConfig} from '../shared/hierarchic-configurations/DomainConfiguration';
import {onlyLeafMaterialHierarchicConfig} from '../shared/hierarchic-configurations/MaterialConfiguration';
import {periodHierarchicConfig} from '../shared/hierarchic-configurations/PeriodConfiguration';
import {onlyLeafTagHierarchicConfig} from '../shared/hierarchic-configurations/TagConfiguration';
import {onlyLeaves} from '../shared/pipes/only-leaves.pipe';
import {getBase64Url} from '../shared/services/utility';
import {StatisticService} from '../statistics/services/statistic.service';
import {TagService} from '../tags/services/tag.service';
import {TagComponent} from '../tags/tag/tag.component';
import {UserService} from '../users/services/user.service';
import {CardService} from './services/card.service';
import {
    FileSelection,
    NaturalAbstractController,
    NaturalFileDropDirective,
    NaturalIconDirective,
    NaturalLinkMutationService,
    NaturalRelationsComponent,
    NaturalTableButtonComponent,
} from '@ecodev/natural';
import {ThemePalette} from '@angular/material/core';
import {StripTagsPipe} from '../shared/pipes/strip-tags.pipe';
import {StampComponent} from '../shared/components/stamp/stamp.component';
import {FilesComponent} from '../files/files/files.component';
import {AddressComponent} from '../shared/components/address/address.component';
import {TextFieldModule} from '@angular/cdk/text-field';
import {ThesaurusComponent} from '../shared/components/thesaurus/thesaurus.component';
import {UniqueCodeValidatorDirective} from '../shared/directives/unique-code-validator.directive';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSliderModule} from '@angular/material/slider';
import {NgScrollbar} from 'ngx-scrollbar';
import {MatIconModule} from '@angular/material/icon';
import {HideTooltipDirective} from '../shared/directives/hide-tooltip.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {LogoComponent} from '../shared/components/logo/logo.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FlexModule} from '@ngbracket/ngx-layout/flex';
import {CommonModule} from '@angular/common';
import {RelatedCardsComponent} from '../shared/components/related-cards/related-cards.component';
import {ExportMenuComponent} from '../shared/components/export-menu/export-menu.component';
import {
    LinkRelatedCardsDialogComponent,
    LinkRelatedCardsDialogData,
    LinkRelatedCardsDialogResult,
} from '../shared/components/link-related-cards-dialog/link-related-cards-dialog.component';
import {Observable, forkJoin} from 'rxjs';
import {state, style, transition, trigger, animate} from '@angular/animations';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export type CardInputWithId = CardInput & {id?: string};

export function cardToCardInput(fetchedModel: Card['card']): CardInputWithId {
    return Object.assign({}, fetchedModel, {
        artists: fetchedModel.artists.map(a => a.name),
        institution: fetchedModel.institution?.name ?? null,
    });
}

export interface VisibilityConfig<V> {
    value: V;
    text: string;
    color: NonNullable<ThemePalette>;
}

type Visibilities<V> = Record<1 | 2 | 3, VisibilityConfig<V>>;
type CardVisibilities = Visibilities<CardVisibility>;
export type CollectionVisibilities = Visibilities<CollectionVisibility>;

interface InitialCardValues {
    page?: InputMaybe<string>;
    figure?: InputMaybe<string>;
    table?: InputMaybe<string>;
    isbn?: InputMaybe<string>;
}

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        NaturalFileDropDirective,
        FlexModule,
        MatToolbarModule,
        LogoComponent,
        MatMenuModule,
        MatButtonModule,
        MatTooltipModule,
        HideTooltipDirective,
        MatIconModule,
        NgScrollbar,
        MatSliderModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        UniqueCodeValidatorDirective,
        QuillEditorComponent,
        ThesaurusComponent,
        TextFieldModule,
        AddressComponent,
        CdkAccordionModule,
        NaturalRelationsComponent,
        NaturalTableButtonComponent,
        FilesComponent,
        StampComponent,
        StripTagsPipe,
        NaturalIconDirective,
        RelatedCardsComponent,
        ExportMenuComponent,
    ],
    animations: [
        trigger('showHideRelatedCards', [
            state(
                'show',
                style({
                    paddingBottom: '120px',
                }),
            ),
            state(
                'hide',
                style({
                    paddingBottom: '0',
                }),
            ),
            transition('* => *', [animate('400ms ease-in-out')]),
        ]),
    ],
})
export class CardComponent extends NaturalAbstractController implements OnInit, OnChanges {
    /**
     * The card as input used for the form and mutation.
     *
     * - Use only `[model]` for mass editing
     * - Use `[model]` and also `[fetchedModel]` when showing the suggestion card of a change
     *
     * If only `[fetchedModel]` is given, then `model` will be automatically deduced.
     */
    @Input() public model!: CardInputWithId;

    /**
     * The card as fetched from DB, if applicable.
     *
     * - Use only `fetchedModel` when showing the original card of a change
     * - Use `[model]` and also `[fetchedModel]` when showing the suggestion card of a change
     *
     * If only `[fetchedModel]` is given, then `model` will be automatically deduced.
     *
     * eg: it will be null if we are mass editing
     */
    @Input() public fetchedModel: Card['card'] | null = null;

    /**
     * For mass edit usage, reference should be hidden/ignored because it is a unique field, and incompatible with mass edit
     */
    @Input() public showCode = true;

    /**
     * Show/Hide toolbar
     */
    @Input() public showToolbar = true;

    /**
     * Show/Hide the right side of the card (image and actions in toolbar)
     */
    @Input() public showImage = true;

    /**
     * Hide related cards
     */
    @Input() public showCards = true;

    /**
     * Hide some toolbar actions
     */
    @Input() public showTools = true;

    /**
     * Show a string on the right of the logo, for "human" contextualisation purposes, like informing if card is source or suggestion
     */
    @Input() public title = '';

    /**
     * Show logo on top of the page if true
     */
    @Input() public showLogo = false;

    /**
     * Base 64 image data for display usage before effective upload
     */
    @Input() public imageData = '';

    /**
     * Display or not the slideshow of related cards.
     */
    @Input() public showSlideshowRelatedCards = false;

    /**
     * Url of resized images (2000px) to be displayed
     */
    public imageSrc!: string;

    /**
     * Url of full sized image (for download purpose)
     */
    public imageSrcFull!: string;

    /**
     * Default visibility
     */
    public visibility: keyof CardVisibilities = 1;

    /**
     * List of visibilities
     */
    public visibilities: CardVisibilities = {
        1: {
            value: CardVisibility.private,
            text: 'par moi, les admins et les abonnés',
            color: 'warn',
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
    public user!: Viewer['viewer'];

    /**
     * Allow to use TAB to go to next field (as is standard)
     */
    public readonly tabToNextFields = {
        tab: {
            key: 9,
            handler: (): true => true,
        },
    };

    public readonly multiLines: QuillModules = {
        ...quillConfig.modules,
        keyboard: {
            bindings: {
                ...this.tabToNextFields,
            },
        },
    };

    public readonly singleLine: QuillModules = {
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
                ...this.tabToNextFields,
            },
        },
    };

    /**
     * Cache institution data from server
     * `this.model` is here considered as CardInput and should receive string, not object
     */
    public institution!: Card['card']['institution'] | UpdateCard['updateCard']['institution'] | null;

    /**
     * Cache artists data from server
     * this.model is here considered as CardInput and should receive string array, not array of objects
     */
    public artists: Card['card']['artists'] | UpdateCard['updateCard']['artists'] = [];

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
     * Sorted list collections by their hierarchicNames
     */
    public sortedCollections: Card['card']['collections'] = [];

    public formIsValid = true;
    public codeModel: NgModel | null = null;
    public urlModel: NgModel | null = null;
    public collectionCopyrights = '';
    public isDilps = true;
    public suggestedCode: string | null = null;

    /**
     * Contains some initial values of the card model. These values are
     * refreshed when the model is persisted.
     */
    public initialCardValues: InitialCardValues = {
        page: '',
        figure: '',
        table: '',
        isbn: '',
    };

    @ViewChild('accordionItem', {static: false}) public accordionItem!: CdkAccordionItem;

    private readonly routeData$: Observable<Data>;
    private readonly routeParams$: Observable<Data>;

    public constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly changeService: ChangeService,
        public readonly cardService: CardService,
        private readonly alertService: AlertService,
        public readonly artistService: ArtistService,
        public readonly institutionService: InstitutionService,
        public readonly materialService: MaterialService,
        public readonly tagService: TagService,
        public readonly documentTypeService: DocumentTypeService,
        public readonly domainService: DomainService,
        public readonly antiqueNameService: AntiqueNameService,
        public readonly periodService: PeriodService,
        private readonly dialog: MatDialog,
        private readonly userService: UserService,
        private readonly statisticService: StatisticService,
        private readonly linkService: NaturalLinkMutationService,
    ) {
        super();

        this.routeData$ = this.route.data.pipe(takeUntilDestroyed());
        this.routeParams$ = this.route.params.pipe(takeUntilDestroyed());
    }

    @Input()
    public set editable(val: boolean) {
        this.edit = val;
    }

    public updateFormValidity(): void {
        this.formIsValid =
            ((!this.urlModel || this.urlModel.valid) && (!this.codeModel || this.codeModel.valid)) ?? false;
    }

    public ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            this.user = user;
        });

        this.routeData$.subscribe(
            data => ({showLogo: this.showLogo, showSlideshowRelatedCards: this.showSlideshowRelatedCards} = data),
        );

        if (this.model && !this.fetchedModel) {
            // When mass editing, show a form with an empty model (without any fetched model)
            this.initCard();
            this.edit = true;
        } else if (!this.model && this.fetchedModel) {
            // When showing a change, we show the original card, and we can infer its model from fetched model
            this.model = cardToCardInput(this.fetchedModel);
            this.initCard();
        } else if (this.model && this.fetchedModel) {
            // When showing a change we show the suggestion card. The fetchedModel is given in order to have
            // access to artists. And the model is also given so that the ChangeComponent is aware
            // when the model is changed via our form.
            // (An better alternative would be to create a new @Output that emits when model change)
            this.initCard();
        } else {
            this.routeParams$.subscribe(params => {
                if (params.cardId) {
                    this.fetchedModel = this.route.snapshot.data.card;
                    this.model = cardToCardInput(this.fetchedModel!);
                    this.initCard();
                } else {
                    throw new Error(
                        'Could not find a model to work with. app-card must receive one of [model] or [fetchedModel], or both, or the route should contain a card ID.',
                    );
                }
            });
        }

        this.statisticService.recordDetail();
    }

    public ngOnChanges(): void {
        this.initCard();
    }

    public get isRelatedCardsReduce(): boolean {
        return localStorage.getItem('isRelatedCardsReduce') === 'true';
    }

    public set isRelatedCardsReduce(value: boolean) {
        localStorage.setItem('isRelatedCardsReduce', value.toString());
    }

    public shouldDisplaySlideShowRelatedCards(): boolean {
        return (
            !this.isRelatedCardsReduce &&
            this.showCards &&
            this.showSlideshowRelatedCards &&
            !!this.fetchedModel &&
            !!this.fetchedModel.cards.length
        );
    }

    public toggleEdit(): void {
        this.edit = !this.edit;
    }

    public dropImage(selection: FileSelection): void {
        const files = selection.valid;
        const file = files[files.length - 1];
        this.model.file = file;
        this.getBase64(file);
    }

    public initCard(): void {
        if (this.model) {
            this.isDilps = this.model.site === Site.dilps;

            // Init visibility
            this.visibility = +findKey(this.visibilities, s => {
                return s.value === this.model.visibility;
            })! as keyof CardVisibilities;

            this.institution = this.fetchedModel?.institution ?? null; // cache, see attribute docs
            this.artists = this.fetchedModel?.artists ?? []; // cache, see attribute docs

            const src = CardService.getImageLink(this.model, 2000);
            if (src) {
                this.imageSrc = src;
            }

            const srcFull = CardService.getImageLink(this.model, null);
            if (srcFull) {
                this.imageSrcFull = srcFull;
            }

            this.updateCollections();

            this.model.tags = onlyLeaves(this.model.tags!);
            this.model.materials = onlyLeaves(this.model.materials!);

            this.refreshInitialCardValues();
        }
    }

    public openCopyRelatedCardsDialog(card: Card['card']): void {
        this.assertFetchedCard(this.fetchedModel);
        this.openRelatedCardsDialog(
            cards => {
                if (cards) {
                    this.assertFetchedCard(this.fetchedModel);

                    this.linkService
                        .linkMany(
                            this.fetchedModel,
                            cards.filter(_card => _card.id != card.id),
                        )
                        .subscribe(() => {
                            this.alertService.info('Liens créés');
                        });
                }
            },
            'Copier les associations',
            `Copie les associations de "${card.name}" vers cette fiche.`,
            cards => {
                const cardIds = cards.map(_card => _card.id);
                // Return all related cards of the specified card filtered by
                // cards already linked.
                return card.cards.filter(_card => !cardIds.includes(_card.id) && _card.id != this.fetchedModel!.id);
            },
            cards => {
                if (cards.length === 0) {
                    this.alertService.info('Toutes les fiches sont déjà associées.');
                    return false;
                }
                return true;
            },
        );
    }

    public openLinkRelatedCardsDialog(): void {
        this.openRelatedCardsDialog(
            cards => {
                // Link all cards to each others (cards already link will not be affected).
                const observables = cards.map(card =>
                    this.linkService.linkMany(
                        card,
                        cards.filter(_card => _card.id != card.id),
                    ),
                );

                forkJoin(observables).subscribe(() => {
                    this.alertService.info('Liens créés dans les autres fiches');
                });
            },
            'Associer plusieurs fiches entre elles',
            'Chaque fiche sélectionnée sera associée à toutes les autres également sélectionnées.',
            identity,
            cards => {
                if (cards.length < 2) {
                    this.alertService.info(
                        'Au moins deux fiches doivent être associées pour utiliser cette fonctionnalité.',
                    );
                    return false;
                }
                return true;
            },
        );
    }

    /**
     * Open the link-related-cards-dialog component.
     *
     * @param process Callback function to process the result of the dialog.
     * @param title Title of the dialog.
     * @param help Help text of the dialog.
     * @param cardsInput Receive the cards (refreshed from db) linked to the
     * current card and return the list of cards to be displayed in the dialog.
     * @param checkCards Cancel the dialog if the returned value is false.
     * Receive the cards returned by cardsInput.
     */
    public openRelatedCardsDialog(
        process: (cards: Card['card']['cards']) => void,
        title: string,
        help: string,
        cardsInput: (cards: Card['card']['cards']) => Card['card']['cards'] = identity,
        checkCards: (cards: Card['card']['cards']) => boolean = identity,
    ): void {
        if (this.fetchedModel) {
            let cardsData: Card['card']['cards'] = [];

            // Getting related cards from database since fetchModel is not
            // updated when we link cards.
            // getOne retrieve cached data first and then fetch them from the
            // database before completing the observable. So we wait on the
            // completed event before opening the dialog.
            this.cardService.getOne(this.fetchedModel.id).subscribe({
                next: card => {
                    cardsData = card.cards;
                },
                complete: () => {
                    const _cardsInput = cardsInput(cardsData);
                    if (checkCards && !checkCards(_cardsInput)) {
                        return;
                    }
                    this.dialog
                        .open<
                            LinkRelatedCardsDialogComponent,
                            LinkRelatedCardsDialogData,
                            LinkRelatedCardsDialogResult
                        >(LinkRelatedCardsDialogComponent, {
                            width: '600px',
                            data: {
                                cards: _cardsInput,
                                title,
                                help,
                            },
                        })
                        .afterClosed()
                        .subscribe(result => result && process(result));
                },
            });
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

        this.cardService.getCollectionCopyrights(this.fetchedModel).subscribe(v => (this.collectionCopyrights = v));

        if (this.fetchedModel.collections.length === 1 && this.fetchedModel.id) {
            const idForCode = this.fetchedModel.legacyId ?? this.fetchedModel.id;
            this.suggestedCode = this.fetchedModel.collections[0].name + '-' + idForCode;
        } else {
            this.suggestedCode = null;
        }
    }

    public canUpdateCode(): boolean {
        return !!this.user && [UserRole.major, UserRole.administrator].includes(this.user.role);
    }

    public showSuggestedCode(): boolean {
        return this.edit && this.canUpdateCode() && !!this.suggestedCode && this.suggestedCode !== this.model.code;
    }

    public updateVisibility(): void {
        this.model.visibility = this.visibilities[this.visibility].value;
    }

    public update(): void {
        if (!this.isFetchedCard(this.model)) {
            return;
        }

        this.cardService.updateNow(this.model).subscribe(card => {
            this.alertService.info('Mis à jour');
            this.institution = card.institution;
            this.artists = card.artists;
            this.refreshInitialCardValues();
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
                    this.fetchedModel = {
                        ...this.fetchedModel,
                        collections: [...result!.collections],
                    };
                    this.updateCollections();
                });
            });
    }

    public complete(): void {
        this.dialog
            .open<CardSelectorComponent, never, Cards['cards']['items'][0]>(CardSelectorComponent, {
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
                    this.fetchedModel = Object.assign({}, selection, {
                        id: this.fetchedModel.id,
                        code: this.fetchedModel.code,
                        visibility: this.model.visibility,
                        permissions: this.fetchedModel.permissions,
                    });

                    this.model = cardToCardInput(this.fetchedModel);
                    this.initCard();
                }
            });
    }

    public getSuggestAddLabel(): string {
        if (this.user?.role === UserRole.junior || this.user?.role === UserRole.senior) {
            return 'Soumettre';
        }

        return "Suggérer l'ajout";
    }

    public canSuggestCreate(): boolean {
        return (
            !!this.user &&
            !!this.fetchedModel &&
            !!this.fetchedModel.owner &&
            this.fetchedModel.owner.id === this.user.id &&
            !!this.fetchedModel.creator &&
            this.fetchedModel.creator.id === this.user.id &&
            this.fetchedModel.visibility === CardVisibility.private
        );
    }

    public canSuggestUpdate(): boolean {
        return UserService.canSuggestUpdate(this.user, this.fetchedModel);
    }

    public canSuggestDelete(): boolean {
        return this.canSuggestUpdate();
    }

    private getBase64(file: File | null): void {
        getBase64Url(file).then(result => {
            this.imageData = result!;
        });
    }

    public displayWith(item: Cards['cards']['items'][0] | null): string {
        if (!item) {
            return '';
        }

        // Turn HTML to plain text
        const temp = document.createElement('div');
        temp.innerHTML = item.name;
        const namePlainText = temp.textContent || temp.innerText || '';

        return namePlainText + ' (' + item.id + ')';
    }

    public useSuggestedCode(event: Event): void {
        event.preventDefault();
        this.model.code = this.suggestedCode;

        // Very short delay before validating to allow propagation of our changes
        setTimeout(() => {
            this.updateFormValidity();
        }, 1);
    }

    private isFetchedCard(card: Card['card'] | CardInput): card is Card['card'] {
        return '__typename' in card;
    }

    private assertFetchedCard(card: Card['card'] | null): asserts card is Card['card'] {
        if (!card) {
            throw new Error(
                'This should only be called with card fetched from DB. There is a logic error that allow user to try to do something that is impossible. A button should be hidden ?',
            );
        }
    }

    public refreshInitialCardValues(): void {
        const {page, figure, table, isbn} = this.model;
        this.initialCardValues = {page, figure, table, isbn};
    }
}

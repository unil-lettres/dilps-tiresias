import {
    FileSelection,
    NaturalFileDropDirective,
    NaturalIconDirective,
    NaturalLinkMutationService,
    NaturalRelationsComponent,
    NaturalTableButtonComponent,
} from '@ecodev/natural';
import {CdkAccordion, CdkAccordionItem} from '@angular/cdk/accordion';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {NgClass} from '@angular/common';
import {Component, inject, Input, input, model, OnChanges, OnInit, viewChild} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule, NgModel} from '@angular/forms';
import {MatButton, MatIconButton, MatMiniFabButton} from '@angular/material/button';
import {ThemePalette} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatList, MatListItem} from '@angular/material/list';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatSlider, MatSliderThumb} from '@angular/material/slider';
import {MatToolbar} from '@angular/material/toolbar';
import {MatTooltip} from '@angular/material/tooltip';
import {ActivatedRoute, Router} from '@angular/router';
import {findKey, identity, sortBy} from 'es-toolkit';
import {QuillEditorComponent, QuillModules} from 'ngx-quill';
import {concatMap, first, from, last} from 'rxjs';
import {filter} from 'rxjs/operators';
import {AntiqueNameComponent} from '../antique-names/antique-name/antique-name.component';
import {AntiqueNameService} from '../antique-names/services/antique-name.service';
import {ArtistComponent} from '../artists/artist/artist.component';
import {ArtistService} from '../artists/services/artist.service';
import {ChangeService} from '../changes/services/change.service';
import {DocumentTypeComponent} from '../document-types/document-type/document-type.component';
import {DocumentTypeService} from '../document-types/services/document-type.service';
import {DomainComponent} from '../domains/domain/domain.component';
import {DomainService} from '../domains/services/domain.service';
import {FilesComponent} from '../files/files/files.component';
import {InstitutionComponent} from '../institutions/institution/institution.component';
import {InstitutionSortedByUsageService} from '../institutions/services/institutionSortedByUsage.service';
import {MaterialComponent} from '../materials/material/material.component';
import {MaterialService} from '../materials/services/material.service';
import {PeriodComponent} from '../periods/period/period.component';
import {PeriodService} from '../periods/services/period.service';
import {AddressComponent} from '../shared/components/address/address.component';
import {AlertService} from '../shared/components/alert/alert.service';
import {CardSelectorComponent} from '../shared/components/card-selector/card-selector.component';
import {
    CollectionSelectorComponent,
    CollectionSelectorData,
    CollectionSelectorResult,
} from '../shared/components/collection-selector/collection-selector.component';
import {ErrorService} from '../shared/components/error/error.service';
import {ExportMenuComponent} from '../shared/components/export-menu/export-menu.component';
import {HistoricIconComponent} from '../shared/components/historic-icon/historic-icon.component';
import {
    LinkRelatedCardsDialogComponent,
    LinkRelatedCardsDialogData,
    LinkRelatedCardsDialogResult,
} from '../shared/components/link-related-cards-dialog/link-related-cards-dialog.component';
import {LogoComponent} from '../shared/components/logo/logo.component';
import {RelatedCardsComponent} from '../shared/components/related-cards/related-cards.component';
import {StampComponent, Stamped} from '../shared/components/stamp/stamp.component';
import {ThesaurusComponent} from '../shared/components/thesaurus/thesaurus.component';
import {quillConfig} from '../shared/config/quill.options';
import {HideTooltipDirective} from '../shared/directives/hide-tooltip.directive';
import {UniqueValidatorDirective} from '../shared/directives/unique-validator.directive';
import {UrlValidatorDirective} from '../shared/directives/url-validator.directive';
import {
    Card,
    CardInput,
    Cards,
    CardVisibility,
    CollectionVisibility,
    InputMaybe,
    JoinType,
    Site,
    UpdateCard,
    UserRole,
    Viewer,
} from '../shared/generated-types';
import {domainHierarchicConfig} from '../shared/hierarchic-configurations/DomainConfiguration';
import {onlyLeafMaterialHierarchicConfig} from '../shared/hierarchic-configurations/MaterialConfiguration';
import {periodHierarchicConfig} from '../shared/hierarchic-configurations/PeriodConfiguration';
import {onlyLeafTagHierarchicConfig} from '../shared/hierarchic-configurations/TagConfiguration';
import {onlyLeaves} from '../shared/pipes/only-leaves.pipe';
import {StripTagsPipe} from '../shared/pipes/strip-tags.pipe';
import {loadImageAsDataUrl} from '../shared/services/utility';
import {StatisticService} from '../statistics/services/statistic.service';
import {TagService} from '../tags/services/tag.service';
import {TagComponent} from '../tags/tag/tag.component';
import {UserService} from '../users/services/user.service';
import {CardSkeletonComponent} from './card-skeleton.component';
import {CardService} from './services/card.service';
import {UPLOAD_CONFIG} from '../shared/config/upload.config';
import {handleFileSizeErrors} from '../shared/utils/file-selection.utils';

export type CardInputWithId = CardInput & {id?: string};

export function cardToCardInput(fetchedModel: Card['card']): CardInputWithId {
    return {
        ...fetchedModel,
        artists: fetchedModel.artists.map(a => a.name),
        institution: fetchedModel.institution?.name ?? null,
    };
}

export type VisibilityConfig<V> = {
    value: V;
    text: string;
    color: NonNullable<ThemePalette>;
};

type Visibilities<V> = Record<1 | 2 | 3, VisibilityConfig<V>>;
type CardVisibilities = Visibilities<CardVisibility>;
export type CollectionVisibilities = Visibilities<CollectionVisibility>;

type InitialCardValues = {
    page?: InputMaybe<string>;
    figure?: InputMaybe<string>;
    table?: InputMaybe<string>;
    isbn?: InputMaybe<string>;
};

@Component({
    selector: 'app-card',
    imports: [
        NgClass,
        NaturalFileDropDirective,
        MatToolbar,
        LogoComponent,
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        MatButton,
        MatMiniFabButton,
        MatIconButton,
        MatTooltip,
        HideTooltipDirective,
        MatIcon,
        MatSlider,
        MatSliderThumb,
        FormsModule,
        MatFormField,
        MatLabel,
        MatError,
        MatHint,
        MatSuffix,
        MatInput,
        QuillEditorComponent,
        ThesaurusComponent,
        CdkTextareaAutosize,
        AddressComponent,
        CdkAccordion,
        CdkAccordionItem,
        NaturalRelationsComponent,
        NaturalTableButtonComponent,
        FilesComponent,
        StampComponent,
        StripTagsPipe,
        NaturalIconDirective,
        RelatedCardsComponent,
        ExportMenuComponent,
        CardSkeletonComponent,
        MatList,
        MatListItem,
        HistoricIconComponent,
        UniqueValidatorDirective,
        UrlValidatorDirective,
    ],
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
})
export class CardComponent implements OnInit, OnChanges {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly changeService = inject(ChangeService);
    protected readonly cardService = inject(CardService);
    protected readonly errorService = inject(ErrorService);
    private readonly alertService = inject(AlertService);
    protected readonly artistService = inject(ArtistService);
    protected readonly institutionSortedByUsageService = inject(InstitutionSortedByUsageService);
    protected readonly materialService = inject(MaterialService);
    protected readonly tagService = inject(TagService);
    protected readonly documentTypeService = inject(DocumentTypeService);
    protected readonly domainService = inject(DomainService);
    protected readonly antiqueNameService = inject(AntiqueNameService);
    protected readonly periodService = inject(PeriodService);
    private readonly dialog = inject(MatDialog);
    private readonly userService = inject(UserService);
    private readonly statisticService = inject(StatisticService);
    private readonly linkService = inject(NaturalLinkMutationService);

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
    public readonly showCode = input(true);

    /**
     * Show/Hide toolbar
     */
    public readonly showToolbar = input(true);

    /**
     * Show/Hide the right side of the card (image and actions in toolbar)
     */
    public readonly showImage = input(true);

    /**
     * Hide related cards
     */
    public readonly showCards = input(true);

    /**
     * Hide some toolbar actions
     */
    public readonly showTools = input(true);

    /**
     * Force vertical display
     */
    public readonly vertical = input(false);

    /**
     * Show a string on the right of the logo, for "human" contextualisation purposes, like informing if card is source or suggestion
     */
    @Input() public title = '';

    /**
     * Show logo on top of the page if true
     */
    public readonly showLogo = model(false);

    /**
     * Base 64 image data for display usage before effective upload
     */
    @Input() public imageData = '';

    /**
     * Display or not the slideshow of related cards.
     */
    public readonly showSlideshowRelatedCards = model(false);

    /**
     * Url of resized images (2000px) to be displayed
     */
    protected imageSrc!: string;

    /**
     * Url of full sized image (for download purpose)
     */
    protected imageSrcFull!: string;

    /**
     * Default visibility
     */
    protected visibility: keyof CardVisibilities = 1;

    /**
     * List of visibilities
     */
    protected visibilities: CardVisibilities = {
        1: {
            value: CardVisibility.Private,
            text: 'par moi, les admins et les abonnés',
            color: 'warn',
        },
        2: {
            value: CardVisibility.Member,
            text: 'par les membres',
            color: 'accent',
        },
        3: {
            value: CardVisibility.Public,
            text: 'par tous',
            color: 'primary',
        },
    };

    /**
     * Currently logged user
     */
    protected user!: Viewer['viewer'];
    protected readonly UserRole = UserRole;

    /**
     * Allow to use TAB to go to next field (as is standard)
     */
    protected readonly tabToNextFields = {
        tab: {
            key: 9,
            handler: (): true => true,
        },
    };

    protected readonly multiLines: QuillModules = {
        ...quillConfig.modules,
        keyboard: {
            bindings: {
                ...this.tabToNextFields,
            },
        },
    };

    protected readonly singleLine: QuillModules = {
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
    protected institution!: Card['card']['institution'] | UpdateCard['updateCard']['institution'] | null;

    /**
     * Cache artists data from server
     * this.model is here considered as CardInput and should receive string array, not array of objects
     */
    protected artists: Card['card']['artists'] | UpdateCard['updateCard']['artists'] = [];

    /**
     * Cache stamped data from server.
     */
    protected stamp: Stamped = {};

    /**
     * Used to display a loading placeholder while the modal is loading.
     * We cannot rely only on the fact that model is null because when we click
     * on a related card, modal is not set back to null. So the placeholder will
     * not show.
     */
    protected loadingIndicator = false;

    /**
     * Used to set a minimum time the placeholder should be displayed to avoid
     * screen flickering.
     *
     * Note about @defer and @placeholder directive: it is not used here because
     * it can't revert back to the placeholder. So there is no way we can display
     * the placeholder when we click on a related card to show again the loading
     * state.
     */
    protected minimalLoadingWait = false;

    /**
     * Template exposed variable
     */
    protected InstitutionComponent = InstitutionComponent;

    /**
     * Template exposed variable
     */
    protected ArtistComponent = ArtistComponent;

    /**
     * Template exposed variable
     */
    protected MaterialComponent = MaterialComponent;
    /**
     * Template exposed variable
     */
    protected PeriodComponent = PeriodComponent;

    /**
     * Template exposed variable
     */
    protected TagComponent = TagComponent;

    /**
     * Template exposed variable
     */
    protected DocumentTypeComponent = DocumentTypeComponent;

    /**
     * Template exposed variable
     */
    protected DomainComponent = DomainComponent;

    /**
     * Template exposed variable
     */
    protected AntiqueNameComponent = AntiqueNameComponent;

    /**
     * Template exposed variable
     */
    protected domainHierarchicConfig = domainHierarchicConfig;

    /**
     * Template exposed variable
     */
    protected tagHierarchicConfig = onlyLeafTagHierarchicConfig;

    /**
     * Template exposed variable
     */
    protected periodHierarchicConfig = periodHierarchicConfig;

    /**
     * Template exposed variable
     */
    protected materialHierarchicConfig = onlyLeafMaterialHierarchicConfig;

    /**
     * Template exposed variable
     */
    protected JoinType = JoinType;

    /**
     * Edition mode if true
     */
    protected edit = false;

    /**
     * Sorted list collections by their hierarchicNames
     */
    protected sortedCollections: Card['card']['collections'] = [];

    protected formIsValid = true;
    protected readonly code = viewChild<NgModel>('code');
    protected readonly url = viewChild<NgModel>('code');
    protected readonly maxFileSize = UPLOAD_CONFIG.MAX_FILE_SIZE;
    protected urlModel: NgModel | null = null;
    protected collectionCopyrights = '';
    protected isDilps = true;
    protected suggestedCode: string | null = null;

    /**
     * Contains some initial values of the card model. These values are
     * refreshed when the model is persisted.
     */
    protected initialCardValues: InitialCardValues = {
        page: '',
        figure: '',
        table: '',
        isbn: '',
    };

    /**
     * Whether the related cards are closed or not.
     * Closed means the related cards are not showing at all, not even reduced.
     */
    protected isRelatedCardsClosed = false;

    private readonly routeData$ = this.route.data.pipe(takeUntilDestroyed());
    private readonly routeParams$ = this.route.params.pipe(takeUntilDestroyed());

    @Input()
    public set editable(val: boolean) {
        this.edit = val;
    }

    protected codeChange(): void {
        this.code()
            ?.statusChanges?.pipe(
                filter(status => status !== 'PENDING'),
                first(),
            )
            .subscribe(() => {
                this.updateFormValidity();
            });
    }

    protected updateFormValidity(): void {
        this.formIsValid = ((!this.urlModel || this.urlModel.valid) && (!this.code() || this.code()?.valid)) ?? false;
    }

    public ngOnChanges(): void {
        this.initCard();
    }

    public ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            this.user = user;
        });

        this.routeData$.subscribe(data => {
            this.showLogo.set(data.showLogo);
            this.showSlideshowRelatedCards.set(data.showSlideshowRelatedCards);
        });

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
                this.loadingIndicator = true;
                this.minimalLoadingWait = true;
                setTimeout(() => {
                    this.minimalLoadingWait = false;
                }, 700);

                if (params.cardId) {
                    const observable = this.cardService.getOne(params.cardId).pipe(last());
                    this.errorService.redirectIfError(observable).subscribe(card => {
                        this.fetchedModel = card;

                        this.model = cardToCardInput(this.fetchedModel);
                        this.loadingIndicator = false;
                        this.initCard();
                    });
                } else {
                    throw new Error(
                        'Could not find a model to work with. app-card must receive one of [model] or [fetchedModel], or both, or the route should contain a card ID.',
                    );
                }
            });
        }

        this.statisticService.recordDetail();
    }

    protected toggleEdit(): void {
        this.edit = !this.edit;
    }

    protected dropImage(selection: FileSelection): void {
        if (selection.valid.length + selection.invalid.length > 1) {
            this.alertService.info("Veuillez déposer un seul fichier pour l'image de la fiche.", 5000);
            return;
        }

        if (handleFileSizeErrors(selection, this.alertService)) {
            return;
        }

        const files = selection.valid;
        if (files.length === 0) {
            return;
        }

        const file = files[0];
        this.model.file = file;
        loadImageAsDataUrl(file).then(result => {
            this.imageData = result;
        });
    }

    protected initCard(): void {
        if (this.model) {
            this.isDilps = this.model.site === Site.Dilps;

            // Init visibility
            this.visibility = findKey(this.visibilities, s => {
                return s.value === this.model.visibility;
            })!;

            this.institution = this.fetchedModel?.institution ?? null; // cache, see attribute docs
            this.artists = this.fetchedModel?.artists ?? []; // cache, see attribute docs

            this.stamp = {
                creator: this.fetchedModel?.creator,
                updater: this.fetchedModel?.updater,
                creationDate: this.fetchedModel?.creationDate,
                updateDate: this.fetchedModel?.updateDate,
            };

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

    protected openCopyRelatedCardsDialog(card: Card['card']): void {
        this.assertFetchedCard(this.fetchedModel);
        let otherCards: Card['card']['cards'] = [];

        this.cardService.getOne(card.id).subscribe({
            next: _card => {
                otherCards = _card.cards;
            },
            complete: () => {
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
                        console.log(otherCards);
                        return otherCards.filter(
                            _card => !cardIds.includes(_card.id) && _card.id != this.fetchedModel!.id,
                        );
                    },
                    cards => {
                        if (cards.length === 0) {
                            this.alertService.info('Toutes les fiches sont déjà associées.');
                            return false;
                        }
                        return true;
                    },
                );
            },
        });
    }

    protected openLinkRelatedCardsDialog(): void {
        this.openRelatedCardsDialog(
            cards => {
                // Link all cards to each others (cards already link will not be affected).
                from(cards)
                    .pipe(
                        concatMap(card =>
                            this.linkService.linkMany(
                                card,
                                cards.filter(_card => _card.id != card.id),
                            ),
                        ),
                    )
                    .subscribe({
                        complete: () => this.alertService.info('Liens créés dans les autres fiches'),
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
    protected openRelatedCardsDialog(
        process: (cards: Card['card']['cards']) => void,
        title: string,
        help: string,
        cardsInput: (cards: Card['card']['cards']) => Card['card']['cards'] = identity,
        checkCards: (cards: Card['card']['cards']) => Card['card']['cards'] | boolean = identity,
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
            c => c.visibility !== CollectionVisibility.Private,
        );
        this.sortedCollections = sortBy(visibleCollections, [c => c.hierarchicName]);

        this.cardService.getCollectionCopyrights(this.fetchedModel).subscribe(v => (this.collectionCopyrights = v));

        if (this.fetchedModel.collections.length === 1 && this.fetchedModel.id) {
            const idForCode = this.fetchedModel.legacyId ?? this.fetchedModel.id;
            this.suggestedCode = this.fetchedModel.collections[0].name + '-' + idForCode;
        } else {
            this.suggestedCode = null;
        }
    }

    protected canUpdateCode(): boolean {
        return !!this.user && [UserRole.major, UserRole.administrator].includes(this.user.role);
    }

    protected showSuggestedCode(): boolean {
        return this.edit && this.canUpdateCode() && !!this.suggestedCode && this.suggestedCode !== this.model.code;
    }

    protected updateVisibility(): void {
        this.model.visibility = this.visibilities[this.visibility].value;
    }

    protected update(): void {
        if (!this.isFetchedCard(this.model)) {
            return;
        }

        this.cardService.updateNow(this.model).subscribe(card => {
            this.alertService.info('Mis à jour');
            this.institution = card.institution;
            this.artists = card.artists;

            this.stamp = {
                ...this.stamp,
                updater: card.updater,
                updateDate: card.updateDate,
            };

            this.refreshInitialCardValues();
            this.edit = false;

            // Clear preview to show server image
            this.imageData = '';
        });
    }

    protected create(): void {
        this.cardService.create(this.model).subscribe(card => {
            this.alertService.info('Créé');
            this.router.navigate(['..', card.id], {relativeTo: this.route});
        });
    }

    protected confirmDelete(): void {
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

    protected suggestUpdate(): void {
        this.assertFetchedCard(this.fetchedModel);
        this.router.navigateByUrl('notification/new/' + this.fetchedModel.id);
    }

    protected suggestDeletion(): void {
        this.assertFetchedCard(this.fetchedModel);
        this.changeService.suggestDeletion(this.fetchedModel).subscribe(() => {
            this.router.navigateByUrl('notification');
        });
    }

    protected suggestCreation(): void {
        this.assertFetchedCard(this.fetchedModel);
        this.changeService.suggestCreation(this.fetchedModel).subscribe(() => {
            this.router.navigateByUrl('notification');
        });
    }

    protected linkToCollection(): void {
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
                        collections: [...result.collections],
                    };
                    this.updateCollections();
                });
            });
    }

    protected complete(): void {
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
                    this.fetchedModel = {
                        ...selection,
                        id: this.fetchedModel.id,
                        code: this.fetchedModel.code,
                        visibility: this.model.visibility!,
                        permissions: this.fetchedModel.permissions,
                    };

                    this.model = cardToCardInput(this.fetchedModel);
                    this.initCard();
                }
            });
    }

    protected getSuggestAddLabel(): string {
        if (this.user?.role === UserRole.junior || this.user?.role === UserRole.senior) {
            return 'Soumettre';
        }

        return "Suggérer l'ajout";
    }

    protected canSuggestCreate(): boolean {
        return (
            !!this.user &&
            !!this.fetchedModel &&
            !!this.fetchedModel.owner &&
            this.fetchedModel.owner.id === this.user.id &&
            !!this.fetchedModel.creator &&
            this.fetchedModel.creator.id === this.user.id &&
            this.fetchedModel.visibility === CardVisibility.Private
        );
    }

    protected canSuggestUpdate(): boolean {
        return UserService.canSuggestUpdate(this.user, this.fetchedModel);
    }

    protected canSuggestDelete(): boolean {
        return this.canSuggestUpdate();
    }

    protected displayWith(item: Cards['cards']['items'][0] | null): string {
        if (!item) {
            return '';
        }

        // Turn HTML to plain text
        const temp = document.createElement('div');
        temp.innerHTML = item.name;
        const namePlainText = temp.textContent || temp.innerText || '';

        return namePlainText + ' (' + item.id + ')';
    }

    protected useSuggestedCode(event: Event): void {
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

    protected refreshInitialCardValues(): void {
        const {page, figure, table, isbn} = this.model;
        this.initialCardValues = {page, figure, table, isbn};
    }
}

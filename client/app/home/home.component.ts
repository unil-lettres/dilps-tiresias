import {Component, computed, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {MatFabButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatDivider} from '@angular/material/divider';
import {MatIcon} from '@angular/material/icon';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatTooltip} from '@angular/material/tooltip';
import {
    ActivatedRoute,
    NavigationEnd,
    Router,
    RouteReuseStrategy,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
} from '@angular/router';
import {
    FileSelection,
    NaturalCompactColorSchemerComponent,
    NaturalFileSelectDirective,
    NaturalIconDirective,
    NetworkActivityService,
} from '@ecodev/natural';
import {NgScrollbar} from 'ngx-scrollbar';
import {EMPTY, Observable, of} from 'rxjs';
import {catchError, concatMap, filter, finalize, map, startWith, tap} from 'rxjs/operators';
import {AppRouteReuseStrategy} from '../app-route-reuse-strategy';
import {SITE} from '../app.config';
import {CardService} from '../card/services/card.service';
import {AlertService} from '../shared/components/alert/alert.service';
import {
    CollectionSelectorComponent,
    CollectionSelectorData,
    CollectionSelectorResult,
} from '../shared/components/collection-selector/collection-selector.component';
import {HistoricIconComponent} from '../shared/components/historic-icon/historic-icon.component';
import {UPLOAD_CONFIG} from '../shared/config/upload.config';
import {HideTooltipDirective} from '../shared/directives/hide-tooltip.directive';
import {Site, UserRole, ViewerQuery} from '../shared/generated-types';
import {handleFileSizeErrors} from '../shared/utils/file-selection.utils';
import {UserService} from '../users/services/user.service';
import {UserComponent} from '../users/user/user.component';
import {WelcomeComponent} from './welcome.component';

function isExcel(file: File): boolean {
    return file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
}

@Component({
    selector: 'app-home',
    imports: [
        MatMenu,
        MatMenuItem,
        MatMenuTrigger,
        RouterLink,
        RouterLinkActive,
        MatSidenav,
        MatSidenavContainer,
        NgScrollbar,
        MatIcon,
        MatTooltip,
        HideTooltipDirective,
        NaturalFileSelectDirective,
        MatProgressSpinner,
        MatDivider,
        RouterOutlet,
        NaturalIconDirective,
        HistoricIconComponent,
        NaturalCompactColorSchemerComponent,
        MatSidenavContent,
        MatFabButton,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    protected readonly route = inject(ActivatedRoute);
    protected readonly router = inject(Router);
    protected readonly userService = inject(UserService);
    protected readonly networkActivityService = inject(NetworkActivityService);
    private readonly snackBar = inject(MatSnackBar);
    private readonly alertService = inject(AlertService);
    private readonly dialog = inject(MatDialog);
    private readonly cardService = inject(CardService);
    protected readonly site = inject(SITE);
    private readonly routeReuse = inject(RouteReuseStrategy);

    protected readonly Site = Site;
    protected readonly UserRole = UserRole;

    protected user: ViewerQuery['viewer'] | null = null;
    protected nav = 1;
    protected progress: number | null = null;
    private uploaded = 0;
    protected readonly maxFileSize = UPLOAD_CONFIG.MAX_FILE_SIZE;

    private readonly routerEvents$ = this.router.events.pipe(
        takeUntilDestroyed(),
        filter(event => event instanceof NavigationEnd),
    );

    private readonly currentUrl = toSignal(
        this.router.events.pipe(
            takeUntilDestroyed(),
            filter(event => event instanceof NavigationEnd),
            map(() => this.router.url),
            startWith(this.router.url),
        ),
    );

    protected readonly isThesaurusActive = computed(() => {
        const url = this.currentUrl() ?? '';
        return [
            '/institution',
            '/artist',
            '/domain',
            '/period',
            '/material',
            '/antique-name',
            '/document-type',
            '/tag',
        ].some(path => url.startsWith(path));
    });

    protected readonly isAdminActive = computed(() => {
        const url = this.currentUrl() ?? '';
        return ['/user', '/news', '/statistic'].some(path => url.startsWith(path));
    });

    private readonly routeFirstChildParams$ = this.route.firstChild?.params.pipe(takeUntilDestroyed());

    public constructor() {
        this.networkActivityService.clearErrors();
    }

    public ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            this.user = user;
        });

        // Hide or show the navigation menu if nav=[0,1] in query string params.
        this.routeFirstChildParams$?.subscribe(params => {
            if (params.nav && /^[01]$/.test(params.nav)) {
                this.nav = +params.nav;
            }
        });

        // When navigating, scroll to top for each scrollable elements to avoid
        // having the previous "page"'s scroll position.
        this.routerEvents$.subscribe(() => {
            document.querySelectorAll('.mat-sidenav-content, .scrollable').forEach(i => i.scroll({top: 0}));
        });

        // Welcome dialog would be shown to visitors once per session
        if (this.userService.hasTempAccess() && sessionStorage.getItem('welcomed') !== 'true') {
            this.showWelcome();
        }
    }

    protected uploadImages(selection: FileSelection): void {
        handleFileSizeErrors(selection, this.alertService);

        const files = selection.valid;
        const excel = files.find(isExcel);
        if (excel) {
            this.uploadImagesAndExcel(
                excel,
                files.filter(f => !isExcel(f)),
            );
        } else {
            this.uploadImagesOnly(files);
        }
    }

    protected uploadImagesOnly(files: File[]): void {
        const inputs = files.map(file => {
            const card = this.cardService.getDefaultForServer();
            card.file = file;

            return card;
        });

        const requireCollection = this.site === Site.Tiresias;
        const collection$ = requireCollection ? this.selectCollection() : of(undefined);
        collection$.subscribe(collection => {
            // Don't do anything if don't have a required collection
            if (requireCollection && !collection) {
                return;
            }

            const total = inputs.length;
            if (!total) {
                return;
            }

            let errors = 0;

            this.progress = 0;
            this.snackBar.open("L'upload est en cours, ne fermez pas votre navigateur", 'Compris', {
                duration: 10000,
                verticalPosition: 'top',
                horizontalPosition: 'end',
            });

            of(...inputs)
                .pipe(
                    concatMap(input => {
                        return this.cardService.createWithCollection(input, collection).pipe(
                            catchError(() => {
                                errors++;

                                return EMPTY;
                            }),
                            tap(() => {
                                this.uploaded++;
                                this.progress = (this.uploaded / total) * 100;
                            }),
                        );
                    }),
                    finalize(() => {
                        if (errors) {
                            const message =
                                total -
                                errors +
                                '/' +
                                total +
                                ' images ont été uploadées. Voir détail dans la pastille en bas à gauche';

                            this.snackBar.open(message, 'Compris', {
                                duration: 15000,
                                panelClass: ['snackbar-error'],
                                verticalPosition: 'top',
                                horizontalPosition: 'end',
                            });
                        } else {
                            this.alertService.info("L'upload est terminé");
                        }

                        this.progress = null;
                        this.uploaded = 0;
                        this.redirectAfterCreation(collection); // we want it before upload has ended
                    }),
                )
                .subscribe();
        });
    }

    protected uploadImagesAndExcel(excel: File, images: File[]): void {
        this.selectCollection().subscribe(collection => {
            this.cardService.createWithExcel(excel, images, collection!).subscribe(() => {
                this.redirectAfterCreation(collection);
            });
        });
    }

    private redirectAfterCreation(collection?: CollectionSelectorResult): void {
        const url = collection ? 'my-collection/' + collection.id : 'my-collection/my-cards';
        this.router.navigateByUrl('/empty', {skipLocationChange: true}).then(() => {
            this.router.navigateByUrl(url).then(() => {
                (this.routeReuse as AppRouteReuseStrategy).clearDetachedRoutes();
            });
        });
    }

    private selectCollection(): Observable<CollectionSelectorResult | undefined> {
        return this.dialog
            .open<CollectionSelectorComponent, CollectionSelectorData, CollectionSelectorResult>(
                CollectionSelectorComponent,
                {
                    width: '400px',
                    data: {},
                },
            )
            .afterClosed();
    }

    protected editUser(): void {
        this.userService.getCurrentUser().subscribe(user => {
            this.dialog.open(UserComponent, {
                width: '800px',
                data: {item: {...user, isSelf: true}},
            });
        });
    }

    protected showNavigationMenu(): boolean {
        return !!this.nav;
    }

    protected showThesaurusMenu(): boolean {
        const dilpsRoles = [UserRole.administrator, UserRole.senior, UserRole.major, UserRole.junior];
        const tiresiasRoles = [UserRole.administrator];
        const applicableRoles = this.site === Site.Dilps ? dilpsRoles : tiresiasRoles;

        return applicableRoles.includes(this.user!.role);
    }

    private showWelcome(): void {
        this.dialog
            .open(WelcomeComponent, {maxWidth: 500})
            .afterClosed()
            .subscribe(login => {
                sessionStorage.setItem('welcomed', 'true');

                if (login) {
                    this.router.navigateByUrl('/login');
                }
            });
    }

    protected mailto(): void {
        document.location.href = 'mailto:' + this.contact();
    }

    protected contact(): string {
        switch (this.site) {
            case Site.Tiresias:
                return 'tiresias@unil.ch';
            case Site.Dilps:
            default:
                return 'infra-lettres@unil.ch';
        }
    }
}

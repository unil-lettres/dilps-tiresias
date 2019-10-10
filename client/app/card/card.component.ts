import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { findKey, merge } from 'lodash';
import { ArtistComponent } from '../artists/artist/artist.component';
import { ArtistService } from '../artists/services/artist.service';
import { ChangeService } from '../changes/services/change.service';
import { InstitutionComponent } from '../institutions/institution/institution.component';
import { InstitutionService } from '../institutions/services/institution.service';
import { AlertService } from '../shared/components/alert/alert.service';
import { CollectionSelectorComponent } from '../shared/components/collection-selector/collection-selector.component';
import { DownloadComponent } from '../shared/components/download/download.component';
import { CardVisibility, UserRole } from '../shared/generated-types';
import { UploadService } from '../shared/services/upload.service';
import { getBase64 } from '../shared/services/utility';
import { UserService } from '../users/services/user.service';
import { CardService } from './services/card.service';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    providers: [UploadService],
})
export class CardComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public model;
    @Input() public hideToolbar = false;
    @Input() public hideImage = false;
    @Input() public hideCards = false;
    @Input() public hideTools = false;
    @Input() public title: string;
    @Input() public showLogo = false;

    @Input() public imageData;
    @Input() public imageSrc;
    @Input() public imageSrcFull;
    public visibility = 1;
    public visibilities = {
        1: {
            value: CardVisibility.private,
            text: 'par moi',
            color: null,
        },
        2: {
            value: CardVisibility.member,
            text: 'par les membres',
            color: 'accent',
        },
        3: {
            value: CardVisibility.public,
            text: 'par tout le monde',
            color: 'primary',
        },
    };
    public institutionComponent = InstitutionComponent;
    public artistComponent = ArtistComponent;
    public institution;
    public artists;
    public user;
    private edit = false;
    private uploadSub;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private changeService: ChangeService,
                public cardService: CardService,
                private alertService: AlertService,
                public artistService: ArtistService,
                public institutionService: InstitutionService,
                private uploadService: UploadService,
                private dialog: MatDialog,
                private userService: UserService,
                private sanitizer: DomSanitizer,
    ) {
    }

    @Input()
    set editable(val: boolean) {
        this.edit = val;
        this.updateUploadWatching();
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
                    this.institution = card.institution;
                    this.model = merge({}, card);
                    this.initCard();
                } else if (!params.cardId && this.model && this.model.id) {
                    this.initCard();
                }
            });
        }

        this.updateUploadWatching();
    }

    ngOnChanges(changes: SimpleChanges) {
        this.initCard();
    }

    ngOnDestroy() {
        this.unwatchUpload();
    }

    public isEdit() {
        return this.edit;
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

            // Init visibility
            this.visibility = +findKey(this.visibilities, (s) => {
                return s.value === this.model.visibility;
            });

            this.artists = this.model.artists;
            this.institution = this.model.institution;

            const src = CardService.getImageLink(this.model, 2000);
            if (src) {
                this.imageSrc = src;
            }

            const srcFull = CardService.getImageLink(this.model, null);
            if (srcFull) {
                this.imageSrcFull = srcFull;
            }
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
        this.cardService.update(this.model).subscribe((card: any) => {
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

        this.dialog.open(CollectionSelectorComponent, {
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
            width: '400px',
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
        return this.user && this.model.creator
               && this.model.owner.id === this.user.id
               && this.model.creator.id === this.user.id
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
}

import {Component, inject, OnInit} from '@angular/core';
import {MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatToolbar} from '@angular/material/toolbar';
import {MatTooltip} from '@angular/material/tooltip';
import {ActivatedRoute, Router} from '@angular/router';
import {NaturalIconDirective} from '@ecodev/natural';
import {merge} from 'es-toolkit';
import {CardComponent, cardToCardInput} from '../../card/card.component';
import {CardService} from '../../card/services/card.service';
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {HideTooltipDirective} from '../../shared/directives/hide-tooltip.directive';
import {CardInput, CardQuery, CardVisibility, ChangeQuery, UserRole, ViewerQuery} from '../../shared/generated-types';
import {UserService} from '../../users/services/user.service';
import {ChangeService} from '../services/change.service';

@Component({
    selector: 'app-change',
    imports: [
        MatToolbar,
        LogoComponent,
        MatTooltip,
        HideTooltipDirective,
        MatIcon,
        CardComponent,
        NaturalIconDirective,
        MatMiniFabButton,
    ],
    templateUrl: './change.component.html',
    styleUrl: './change.component.scss',
})
export class ChangeComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly changeService = inject(ChangeService);
    private readonly cardService = inject(CardService);
    private readonly userService = inject(UserService);
    protected readonly UserRole = UserRole;

    protected change!: ChangeQuery['change'];
    protected original: CardQuery['card'] | null = null;
    protected fetchedSuggestion: CardQuery['card'] | null = null;
    protected suggestionInput: CardInput | null = null;
    protected loaded = false;
    protected user!: ViewerQuery['viewer'];
    protected showTools = false;

    public ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => (this.user = user));

        if (this.route.snapshot.params.changeId) {
            // Show an existing change (to further edit, or accept/reject)
            this.changeService.getOne(this.route.snapshot.params.changeId).subscribe(change => {
                this.change = merge({}, change);
                this.original = this.change.original;
                this.fetchedSuggestion = change.suggestion;
                if (this.fetchedSuggestion) {
                    this.suggestionInput = Object.assign(cardToCardInput(this.fetchedSuggestion), {code: ''});
                } else {
                    this.suggestionInput = null;
                }
                this.showTools = true;
                this.loaded = true;
            });
        } else if (this.route.snapshot.params.cardId) {
            // Create a new change from an existing card
            this.cardService.getOne(this.route.snapshot.params.cardId).subscribe(card => {
                this.original = merge({}, card);
                this.fetchedSuggestion = merge(merge({}, card), {
                    original: card,
                    visibility: CardVisibility.Private,
                });
                this.suggestionInput = cardToCardInput(this.fetchedSuggestion);
                this.suggestionInput.code = '';
                this.loaded = true;
            });
        } else {
            this.suggestionInput = this.cardService.getDefaultForServer();
            this.loaded = true;
        }
    }

    protected accept(): void {
        this.changeService.acceptChange(this.change).subscribe(card => {
            if (card) {
                this.router.navigateByUrl('card/' + card.id);
            } else {
                this.router.navigateByUrl('notification');
            }
        });
    }

    protected reject(): void {
        this.changeService.rejectChange(this.change).subscribe(() => {
            this.router.navigate(['..', 'notification']);
        });
    }

    protected update(): void {
        this.cardService.create(this.suggestionInput!).subscribe(card => {
            this.changeService.suggestUpdate(card).subscribe(() => {
                this.router.navigateByUrl('notification');
            });
        });
    }

    protected create(): void {
        this.cardService.create(this.suggestionInput!).subscribe(card => {
            this.changeService.suggestCreation(card).subscribe(() => {
                this.router.navigateByUrl('notification');
            });
        });
    }
}

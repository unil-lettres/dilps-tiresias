import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {merge} from 'lodash-es';
import {CardComponent, cardToCardInput} from '../../card/card.component';
import {CardService} from '../../card/services/card.service';
import {Card, CardInput, CardVisibility, Change, UserRole, Viewer} from '../../shared/generated-types';
import {UserService} from '../../users/services/user.service';
import {ChangeService} from '../services/change.service';
import {MatIconModule} from '@angular/material/icon';
import {HideTooltipDirective} from '../../shared/directives/hide-tooltip.directive';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {LogoComponent} from '../../shared/components/logo/logo.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {NaturalIconDirective} from '@ecodev/natural';

@Component({
    selector: 'app-change',
    templateUrl: './change.component.html',
    styleUrl: './change.component.scss',
    imports: [
        MatToolbarModule,
        LogoComponent,
        MatButtonModule,
        MatTooltipModule,
        HideTooltipDirective,
        MatIconModule,
        CardComponent,
        NaturalIconDirective,
    ],
})
export class ChangeComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly changeService = inject(ChangeService);
    private readonly cardService = inject(CardService);
    private readonly userService = inject(UserService);
    public readonly UserRole = UserRole;

    public change!: Change['change'];
    public original: Card['card'] | null = null;
    public fetchedSuggestion: Card['card'] | null = null;
    public suggestionInput: CardInput | null = null;
    public loaded = false;
    public user!: Viewer['viewer'];
    public showTools = false;

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
                this.fetchedSuggestion = merge({}, card, {
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

    public accept(): void {
        this.changeService.acceptChange(this.change).subscribe(card => {
            if (card) {
                this.router.navigateByUrl('card/' + card.id);
            } else {
                this.router.navigateByUrl('notification');
            }
        });
    }

    public reject(): void {
        this.changeService.rejectChange(this.change).subscribe(() => {
            this.router.navigate(['..', 'notification']);
        });
    }

    public update(): void {
        this.cardService.create(this.suggestionInput!).subscribe(card => {
            this.changeService.suggestUpdate(card).subscribe(() => {
                this.router.navigateByUrl('notification');
            });
        });
    }

    public create(): void {
        this.cardService.create(this.suggestionInput!).subscribe(card => {
            this.changeService.suggestCreation(card).subscribe(() => {
                this.router.navigateByUrl('notification');
            });
        });
    }
}

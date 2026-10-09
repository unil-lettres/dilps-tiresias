import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

/**
 * A discreet informative message, introduced by an icon, to explain a feature to the user.
 */
@Component({
    selector: 'app-hint',
    imports: [MatIcon],
    template: `
        <mat-icon class="icon" [fontIcon]="icon()" />
        <div class="message"><ng-content /></div>
    `,
    styles: `
        :host {
            display: flex;
            position: relative;
            align-items: flex-start;
            gap: 5px;
            border-radius: var(--mat-sys-corner-medium);
            background-color: var(--mat-sys-surface-variant);
            padding: 12px 16px;
            color: var(--mat-sys-on-surface-variant);
            font-size: var(--mat-sys-body-medium-size);
            line-height: var(--line-height);
        }

        .icon {
            flex: none;
            color: var(--mat-sys-primary);
        }

        .message {
            min-width: 0;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HintComponent {
    /**
     * Any Material Symbols icon name.
     */
    public readonly icon = input('info');
}

import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatFabButton, MatMiniFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {NaturalIconDirective} from '@ecodev/natural';

/**
 * "Create" action at the end of a toolbar: an extended FAB showing its label on wide screens, and on small
 * screens the same mini FAB as the collections page, with the label as tooltip and accessible name.
 *
 * Listen to its native `click` event.
 */
@Component({
    selector: 'app-create-button',
    imports: [MatFabButton, MatMiniFabButton, MatIcon, MatTooltip, NaturalIconDirective],
    templateUrl: './create-button.component.html',
    styleUrl: './create-button.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateButtonComponent {
    public readonly label = input.required<string>();
}

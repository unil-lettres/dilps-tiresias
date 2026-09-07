import {type EnvironmentProviders, inject, provideAppInitializer} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import cardsGame from '../../../assets/icons/cards_game.svg';
import libraryRemove from '../../../assets/icons/library_remove.svg';
import selectAllMark from '../../../assets/icons/select_all_mark.svg';
import sortAsc from '../../../assets/icons/sort_asc.svg';

/**
 * Register our custom icons, their content is inlined in the bundle at build
 * time.
 */
export const iconsProvider: EnvironmentProviders = provideAppInitializer(() => {
    const matIconRegistry = inject(MatIconRegistry);
    const domSanitizer = inject(DomSanitizer);
    const icons = {
        sort_asc: sortAsc,
        library_remove: libraryRemove,
        select_all_mark: selectAllMark,
        cards_game: cardsGame,
    };

    for (const [name, svg] of Object.entries(icons)) {
        matIconRegistry.addSvgIconLiteral(name, domSanitizer.bypassSecurityTrustHtml(svg));
    }
});

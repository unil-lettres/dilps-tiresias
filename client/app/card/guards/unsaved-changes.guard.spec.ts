import {TestBed} from '@angular/core/testing';
import {MatDialog} from '@angular/material/dialog';
import {type ActivatedRouteSnapshot, type RouterStateSnapshot} from '@angular/router';
import {firstValueFrom, isObservable, type Observable, of} from 'rxjs';
import {type CardComponent} from '../card.component';
import {type UnsavedChangesDialogResult} from '../../shared/components/unsaved-changes-dialog/unsaved-changes-dialog.component';
import {canDeactivateCard} from './unsaved-changes.guard';

describe('canDeactivateCard', () => {
    let dialog: {open: ReturnType<typeof vi.fn>};
    let card: {edit: boolean; save: ReturnType<typeof vi.fn>; discardChanges: ReturnType<typeof vi.fn>};

    function leave(edit: boolean, choice?: UnsavedChangesDialogResult, saved = true): Promise<unknown> {
        dialog = {open: vi.fn(() => ({afterClosed: () => of(choice)}))};
        card = {edit, save: vi.fn(() => of(saved)), discardChanges: vi.fn()};
        TestBed.configureTestingModule({providers: [{provide: MatDialog, useValue: dialog}]});

        const result = TestBed.runInInjectionContext(() =>
            canDeactivateCard(
                card as unknown as CardComponent,
                {} as ActivatedRouteSnapshot,
                {} as RouterStateSnapshot,
                {} as RouterStateSnapshot,
            ),
        );

        return isObservable(result) ? firstValueFrom(result as Observable<unknown>) : Promise.resolve(result);
    }

    it('leaves a card that is not being edited, without asking', async () => {
        expect(await leave(false)).toBe(true);
        expect(dialog.open).not.toHaveBeenCalled();
    });

    it('saves the changes before leaving, if asked', async () => {
        expect(await leave(true, 'save')).toBe(true);
        expect(card.save).toHaveBeenCalled();
        expect(card.discardChanges).not.toHaveBeenCalled();
    });

    it('stays if the changes could not be saved', async () => {
        expect(await leave(true, 'save', false)).toBe(false);
    });

    it('discards the changes before leaving, if asked', async () => {
        expect(await leave(true, 'discard')).toBe(true);
        expect(card.discardChanges).toHaveBeenCalled();
        expect(card.save).not.toHaveBeenCalled();
    });

    it('stays if the dialog is cancelled', async () => {
        expect(await leave(true, undefined)).toBe(false);
        expect(card.save).not.toHaveBeenCalled();
        expect(card.discardChanges).not.toHaveBeenCalled();
    });
});

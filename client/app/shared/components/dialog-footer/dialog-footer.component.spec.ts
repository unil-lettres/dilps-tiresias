import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {MatDialogRef} from '@angular/material/dialog';
import {DialogFooterComponent} from './dialog-footer.component';

describe('DialogFooterComponent', () => {
    let fixture: ComponentFixture<DialogFooterComponent>;

    function buttons(
        item: DialogFooterComponent['item'],
        inputs: {canCreate?: boolean; readOnly?: boolean} = {},
    ): string[] {
        TestBed.resetTestingModule();
        TestBed.configureTestingModule({providers: [{provide: MatDialogRef, useValue: {close: vi.fn()}}]});
        fixture = TestBed.createComponent(DialogFooterComponent);
        fixture.componentInstance.item = item;
        fixture.componentRef.setInput('readOnly', inputs.readOnly ?? false);
        fixture.componentRef.setInput('canCreate', inputs.canCreate ?? false);
        fixture.detectChanges();

        // The text of the buttons, without their icons
        return Array.from<HTMLButtonElement>(fixture.nativeElement.querySelectorAll('button')).map(button =>
            (button.textContent ?? '').replace(/\b(delete_forever|save|add)\b/g, '').trim(),
        );
    }

    it('offers to add a new object, if allowed', () => {
        expect(buttons({}, {canCreate: true})).toEqual(['Annuler', 'Ajouter']);
    });

    it('offers nothing but to cancel a new object, if not allowed', () => {
        expect(buttons({}, {canCreate: false})).toEqual(['Annuler']);
    });

    it('offers to save and delete an existing object, if allowed', () => {
        expect(buttons({id: '1', permissions: {update: true, delete: true}})).toEqual([
            'Supprimer',
            'Annuler',
            'Enregistrer',
        ]);
        expect(buttons({id: '1', permissions: {update: true, delete: false}})).toEqual(['Annuler', 'Enregistrer']);
    });

    it('offers only to close an existing object that cannot be changed', () => {
        expect(buttons({id: '1', permissions: {update: false, delete: false}})).toEqual(['Fermer']);
    });

    it('offers only to close a read-only dialog', () => {
        expect(buttons({id: '1', permissions: {update: true, delete: true}}, {readOnly: true})).toEqual(['Fermer']);
    });
});

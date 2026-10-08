import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {provideRouter} from '@angular/router';
import {of} from 'rxjs';
import {ThesaurusComponent, type ThesaurusModel} from './thesaurus.component';

type Testable = {
    items: ThesaurusModel[];
    suggestions: ThesaurusModel[];
    removeTerm: (term: ThesaurusModel) => void;
    getLabel: (item: ThesaurusModel) => string;
    getParentHierarchy: (item: ThesaurusModel) => string | null;
};

describe('ThesaurusComponent', () => {
    const existing = {id: '1', name: 'Existing'};
    let fixture: ComponentFixture<ThesaurusComponent<never>>;
    let emitted: unknown[];
    let suggestions: ThesaurusModel[];

    function create(
        model: ThesaurusModel | ThesaurusModel[] | null,
        options: {multiple?: boolean; allowFreeText?: boolean; readonly?: boolean} = {},
    ): Testable {
        TestBed.configureTestingModule({providers: [provideRouter([])]});
        const service = {
            watchAll: () => of({items: suggestions, length: suggestions.length, pageIndex: 0, pageSize: 30}),
        };

        fixture = TestBed.createComponent(ThesaurusComponent<never>);
        fixture.componentRef.setInput('service', service);
        fixture.componentRef.setInput('placeholder', 'Artistes');
        fixture.componentRef.setInput('model', model);
        for (const [name, value] of Object.entries(options)) {
            fixture.componentRef.setInput(name, value);
        }

        emitted = [];
        (
            fixture.componentInstance as unknown as {modelChange: {subscribe: (fn: (v: unknown) => void) => void}}
        ).modelChange.subscribe(value => emitted.push(value));
        fixture.detectChanges();

        return fixture.componentInstance as unknown as Testable;
    }

    function input(): HTMLInputElement {
        return fixture.nativeElement.querySelector('input');
    }

    function type(value: string): void {
        input().value = value;
        input().dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter'}));
        fixture.detectChanges();
    }

    beforeEach(() => {
        suggestions = [];
    });

    it('adds the text typed, and gives the names of all terms', () => {
        create([existing]);

        type('New artist');

        expect(emitted.at(-1)).toEqual(['Existing', 'New artist']);
        expect(input().value).toBe('');
    });

    it('does not add the same term twice', () => {
        const component = create([existing]);

        type('Existing');

        expect(component.items.map(item => item.name)).toEqual(['Existing']);
    });

    it('replaces the term when only one is allowed', () => {
        create(existing, {multiple: false});

        type('Other');

        expect(emitted.at(-1)).toBe('Other');
    });

    it('ignores the text typed if only existing terms are allowed', () => {
        const component = create([existing], {allowFreeText: false});

        type('New artist');

        expect(component.items).toEqual([existing]);
    });

    it('gives the terms themselves, if only existing terms are allowed', () => {
        const component = create([existing, {id: '2', name: 'Other'}], {allowFreeText: false});

        component.removeTerm({name: 'Other'});

        expect(emitted.at(-1)).toEqual([existing]);
    });

    it('gives null once the only term is removed', () => {
        const component = create(existing, {multiple: false, allowFreeText: false});

        component.removeTerm(existing);

        expect(emitted.at(-1)).toBeNull();
    });

    it('shows the parents of a term', () => {
        const component = create(null);

        expect(component.getParentHierarchy({name: 'Empire', hierarchicName: 'Antiquité > Rome > Empire'})).toBe(
            'Antiquité > Rome',
        );
        expect(component.getParentHierarchy({name: 'Antiquité', hierarchicName: 'Antiquité'})).toBeNull();
        expect(component.getParentHierarchy({name: 'Artist'})).toBeNull();
    });

    it('shows the years of a period while editing', () => {
        const period = {name: 'Empire', __typename: 'Period', from: -27, to: 476};

        expect(create(null).getLabel(period)).toBe('Empire (entre -27 et 476)');

        TestBed.resetTestingModule();
        expect(create(null, {readonly: true}).getLabel(period)).toBe('Empire');
    });

    // Known bug: the suggestions should exclude the terms already chosen, but the filter compares the position of
    // the term with zero, so only the first chosen term is excluded. Replace `it.fails` by `it` once fixed.
    it.fails('does not suggest the terms already chosen', () => {
        suggestions = [
            {id: '1', name: 'First'},
            {id: '2', name: 'Second'},
            {id: '3', name: 'Third'},
        ];
        const component = create([
            {id: '1', name: 'First'},
            {id: '2', name: 'Second'},
        ]);

        input().dispatchEvent(new Event('focus'));
        fixture.detectChanges();

        expect(component.suggestions.map(item => item.name)).toEqual(['Third']);
    });
});

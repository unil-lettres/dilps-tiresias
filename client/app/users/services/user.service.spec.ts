import {type CardQuery, CardVisibility, UserRole, type ViewerQuery} from '../../shared/generated-types';
import {UserService} from './user.service';

const student = {id: '1003', role: UserRole.student} as ViewerQuery['viewer'];
const other = {id: '1002'};

function card(
    visibility: CardVisibility,
    owner: {id: string} | null,
    creator: {id: string} | null = owner,
): CardQuery['card'] {
    return {id: '6000', visibility, owner, creator} as CardQuery['card'];
}

describe('UserService.canSuggestUpdate', () => {
    it('lets suggest on the cards of someone else', () => {
        expect(UserService.canSuggestUpdate(student, card(CardVisibility.Private, other))).toBe(true);
        expect(UserService.canSuggestUpdate(student, card(CardVisibility.Member, other))).toBe(true);
    });

    it('lets suggest on the shared cards, including our own ones', () => {
        expect(UserService.canSuggestUpdate(student, card(CardVisibility.Member, student))).toBe(true);
        expect(UserService.canSuggestUpdate(student, card(CardVisibility.Public, null))).toBe(true);
    });

    it('does not let suggest on our own private cards, that we can edit directly', () => {
        expect(UserService.canSuggestUpdate(student, card(CardVisibility.Private, student))).toBe(false);
    });

    it('does not let suggest without user or card', () => {
        expect(UserService.canSuggestUpdate(null, card(CardVisibility.Public, other))).toBe(false);
        expect(UserService.canSuggestUpdate(student, null)).toBe(false);
    });
});

describe('UserService.canSuggestCreate', () => {
    it('lets submit our own private cards', () => {
        expect(UserService.canSuggestCreate(student, card(CardVisibility.Private, student))).toBe(true);
    });

    it('does not let submit cards already shared', () => {
        expect(UserService.canSuggestCreate(student, card(CardVisibility.Member, student))).toBe(false);
        expect(UserService.canSuggestCreate(student, card(CardVisibility.Public, student))).toBe(false);
    });

    it('does not let submit the cards that someone else owns or created', () => {
        expect(UserService.canSuggestCreate(student, card(CardVisibility.Private, other))).toBe(false);
        expect(UserService.canSuggestCreate(student, card(CardVisibility.Private, student, other))).toBe(false);
        expect(UserService.canSuggestCreate(student, card(CardVisibility.Private, null))).toBe(false);
    });

    it('does not let submit without user or card', () => {
        expect(UserService.canSuggestCreate(null, card(CardVisibility.Private, student))).toBe(false);
        expect(UserService.canSuggestCreate(student, null)).toBe(false);
    });
});

import {CombinedGraphQLErrors, ServerError} from '@apollo/client';
import {serverErrorToUserFriendlyError, translateTechnicalError} from './apollo-options.provider';

describe('translateTechnicalError', () => {
    it('translates the technical messages that we do not write ourselves', () => {
        expect(translateTechnicalError('Variable "$login" got invalid value "foo "; Not a valid Login: "foo "')).toBe(
            "Une des valeurs saisies n'est pas valide.",
        );
        expect(translateTechnicalError('String data, right truncated')).toBe('Un des textes saisis est trop long.');
        expect(translateTechnicalError('Numeric value out of range')).toBe('Un des nombres saisis est trop grand.');
        expect(translateTechnicalError('Invalid datetime format')).toBe("Une des dates saisies n'est pas valide.");
        expect(translateTechnicalError('The uploaded file exceeds the upload_max_filesize directive in php.ini')).toBe(
            'Le fichier dépasse la limite de taille autorisée.',
        );
        expect(translateTechnicalError('POST Content-Length exceeds the limit of post_max_size')).toBe(
            'La taille totale des données envoyées dépasse la limite autorisée.',
        );
        expect(translateTechnicalError('Maximum execution time of 30 seconds exceeded')).toBe(
            "L'opération a pris trop de temps à s'exécuter.",
        );
        expect(translateTechnicalError('max_execution_time reached')).toBe(
            "L'opération a pris trop de temps à s'exécuter.",
        );
    });

    it('keeps the messages that we write ourselves', () => {
        expect(translateTechnicalError("Ce compte n'est plus actif")).toBe("Ce compte n'est plus actif");
    });
});

describe('serverErrorToUserFriendlyError', () => {
    function serverError(status: number, body: string): ServerError {
        return new ServerError('Server error', {response: new Response(body, {status}), bodyText: body});
    }

    function messages(error: unknown): string[] {
        return CombinedGraphQLErrors.is(error) ? error.errors.map(e => e.message) : [];
    }

    it('shows the message of a request too big or too long, if the server gives only a message', () => {
        for (const status of [413, 500]) {
            const error = serverErrorToUserFriendlyError(serverError(status, '{"message": "post_max_size"}'), {});

            expect(messages(error)).toEqual(['post_max_size']);
            expect(CombinedGraphQLErrors.is(error) && error.errors[0].extensions?.showSnack).toBe(true);
        }
    });

    it('keeps the error if the server gives more, or something else than a message', () => {
        const withMore = serverError(500, '{"message": "Internal", "trace": []}');
        const notJson = serverError(500, '<html>Fatal error</html>');
        const notFound = serverError(404, '{"message": "Not found"}');

        expect(serverErrorToUserFriendlyError(withMore, {})).toBe(withMore);
        expect(serverErrorToUserFriendlyError(notJson, {})).toBe(notJson);
        expect(serverErrorToUserFriendlyError(notFound, {})).toBe(notFound);
    });

    it('explains a crash while processing an image', () => {
        const variables = {input: {name: 'Card', file: new File(['image'], 'image.tiff')}};

        expect(messages(serverErrorToUserFriendlyError(serverError(502, ''), variables))).toEqual([
            "L'image n'a pas pu être traitée par le serveur. Essayez de convertir l'image dans un autre format.",
        ]);
    });

    it('keeps a crash without image', () => {
        const error = serverError(502, '');

        expect(serverErrorToUserFriendlyError(error, {input: {name: 'Card'}})).toBe(error);
    });

    it('keeps the errors that do not come from the server', () => {
        const error = new Error('Network down');

        expect(serverErrorToUserFriendlyError(error, {})).toBe(error);
    });
});

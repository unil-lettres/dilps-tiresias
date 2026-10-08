import {type FileSelection} from '@ecodev/natural';
import {type AlertService} from '../components/alert/alert.service';
import {handleFileSizeErrors} from './file-selection.utils';

describe('handleFileSizeErrors', () => {
    const big = new File(['big'], 'big.tiff');
    const huge = new File(['huge'], 'huge.tiff');
    const other = new File(['other'], 'other.exe');
    let alertService: {error: ReturnType<typeof vi.fn>};

    beforeEach(() => {
        alertService = {error: vi.fn()};
    });

    function handle(selection: FileSelection): boolean {
        return handleFileSizeErrors(selection, alertService as unknown as AlertService);
    }

    it('tells nothing if all files are valid', () => {
        expect(handle({valid: [big], invalid: []})).toBe(false);
        expect(alertService.error).not.toHaveBeenCalled();
    });

    it('ignores other errors than the size', () => {
        expect(handle({valid: [], invalid: [{file: other, error: 'accept'}]})).toBe(false);
        expect(alertService.error).not.toHaveBeenCalled();
    });

    it('names the file too big', () => {
        expect(handle({valid: [], invalid: [{file: big, error: 'fileSize'}]})).toBe(true);
        expect(alertService.error).toHaveBeenCalledWith('Fichier "big.tiff" trop volumineux (max 100 Mo)', 5000);
    });

    it('counts and names the files too big', () => {
        const selection = {
            valid: [],
            invalid: [
                {file: big, error: 'fileSize'},
                {file: other, error: 'accept'},
                {file: huge, error: 'fileSize'},
            ],
        };

        expect(handle(selection)).toBe(true);
        expect(alertService.error).toHaveBeenCalledWith(
            '2 fichiers trop volumineux (max 100 Mo) : big.tiff, huge.tiff',
            5000,
        );
    });
});

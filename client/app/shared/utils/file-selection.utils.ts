import {FileSelection} from '@ecodev/natural';
import {AlertService} from '../components/alert/alert.service';
import {UPLOAD_CONFIG} from '../config/upload.config';

/**
 * Display an alert for files that exceed the maximum allowed size.
 * @param selection The file selection potentially containing errors
 * @param alertService Service to display the alert
 * @returns true if size errors were found and displayed
 */
export function handleFileSizeErrors(selection: FileSelection, alertService: AlertService): boolean {
    if (selection.invalid.length === 0) {
        return false;
    }

    const fileSizeErrors = selection.invalid.filter(invalid => invalid.error === 'fileSize');
    if (fileSizeErrors.length === 0) {
        return false;
    }

    const fileNames = fileSizeErrors.map(invalid => invalid.file.name).join(', ');
    const count = fileSizeErrors.length;
    const message =
        count === 1
            ? `Fichier "${fileNames}" trop volumineux (max ${UPLOAD_CONFIG.MAX_FILE_SIZE_LABEL})`
            : `${count} fichiers trop volumineux (max ${UPLOAD_CONFIG.MAX_FILE_SIZE_LABEL}) : ${fileNames}`;

    alertService.error(message, 5000);
    return true;
}

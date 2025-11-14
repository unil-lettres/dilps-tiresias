/**
 * Upload configuration for files.
 */
export const UPLOAD_CONFIG = {
    /**
     * Maximum file size in bytes.
     */
    MAX_FILE_SIZE: 100 * 1024 * 1024, // 100 MB

    /**
     * Maximum file size in human-readable format
     */
    MAX_FILE_SIZE_LABEL: '100 Mo',

    /**
     * Accepted file types for card attachment upload.
     *
     * Note: This list should be kept in sync with \Application\Model\File::getAcceptedMimeTypes
     */
    ACCEPTED_CARD_FILES_TYPES: '.pdf,.doc,.docx,.xls,.xlsx,.odt,.ods',
} as const;

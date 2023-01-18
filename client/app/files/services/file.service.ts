import {Apollo} from 'apollo-angular';
import {Injectable} from '@angular/core';
import {NaturalAbstractModelService, NaturalDebounceService} from '@ecodev/natural';
import {createFileMutation, deleteFileMutation, filesQuery} from './file.queries';
import {
    CreateFile,
    CreateFileVariables,
    DeleteFile,
    DeleteFileVariables,
    FileInput,
    Files_files,
    FilesVariables,
} from '../../shared/generated-types';

@Injectable({
    providedIn: 'root',
})
export class FileService extends NaturalAbstractModelService<
    any,
    any,
    Files_files,
    FilesVariables,
    CreateFile['createFile'],
    CreateFileVariables,
    any,
    any,
    DeleteFile,
    DeleteFileVariables
> {
    public constructor(apollo: Apollo, naturalDebounceService: NaturalDebounceService) {
        super(apollo, naturalDebounceService, 'file', null, filesQuery, createFileMutation, null, deleteFileMutation);
    }

    protected override getDefaultForServer(): FileInput {
        return {
            card: null,
            name: '',
            file: null,
        };
    }
}

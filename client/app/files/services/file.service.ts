import {Injectable} from '@angular/core';
import {NaturalAbstractModelService} from '@ecodev/natural';
import {createFileMutation, deleteFileMutation, filesQuery} from './file.queries';
import {
    CreateFile,
    CreateFileVariables,
    DeleteFile,
    DeleteFileVariables,
    FileInput,
    FilesQuery,
    FilesQueryVariables,
} from '../../shared/generated-types';

@Injectable({
    providedIn: 'root',
})
export class FileService extends NaturalAbstractModelService<
    never,
    never,
    FilesQuery['files'],
    FilesQueryVariables,
    CreateFile['createFile'],
    CreateFileVariables,
    never,
    never,
    DeleteFile,
    DeleteFileVariables
> {
    public constructor() {
        super('file', null, filesQuery, createFileMutation, null, deleteFileMutation);
    }

    public override getDefaultForServer(): FileInput {
        return {
            card: null,
            name: '',
            file: null,
        };
    }
}

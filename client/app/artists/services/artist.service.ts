import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
    Artist,
    Artists,
    CreateArtist,
    DeleteArtists,
    UpdateArtist,
} from '../../shared/generated-types';
import { AbstractModelService } from '../../shared/services/abstract-model.service';
import { artistQuery, artistsQuery, createArtist, deleteArtists, updateArtist } from './artistQueries';

@Injectable({
    providedIn: 'root',
})
export class ArtistService
    extends AbstractModelService<Artist['artist'],
        Artists['artists'],
        CreateArtist['createArtist'],
        UpdateArtist['updateArtist'],
        DeleteArtists['deleteArtists']> {

    constructor(apollo: Apollo) {
        super(apollo,
            'artist',
            artistQuery,
            artistsQuery,
            createArtist,
            updateArtist,
            deleteArtists);
    }

    public getConsolidatedForClient() {
        return this.getDefaultForServer();
    }

    public getDefaultForServer() {
        return {
            name: '',
        };
    }

}

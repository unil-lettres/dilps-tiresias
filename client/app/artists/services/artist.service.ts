import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
    Artist,
    Artists, ArtistsVariables, ArtistVariables,
    CreateArtist, CreateArtistVariables,
    DeleteArtists,
    UpdateArtist, UpdateArtistVariables,
} from '../../shared/generated-types';
import { artistQuery, artistsQuery, createArtist, deleteArtists, updateArtist } from './artistQueries';
import { NaturalAbstractModelService } from '@ecodev/natural';

@Injectable({
    providedIn: 'root',
})
export class ArtistService
    extends NaturalAbstractModelService<Artist['artist'],
        ArtistVariables,
        Artists['artists'],
        ArtistsVariables,
        CreateArtist['createArtist'],
        CreateArtistVariables,
        UpdateArtist['updateArtist'],
        UpdateArtistVariables,
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

import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import {
    ArtistInput,
    ArtistQuery,
    ArtistsQuery,
    CreateArtistMutation,
    DeleteArtistsMutation,
    UpdateArtistMutation,
} from '../../shared/generated-types';
import { AbstractModelService } from '../../shared/services/abstract-model.service';
import { artistQuery, artistsQuery, createArtistMutation, deleteArtistsMutation, updateArtistMutation } from './artistQueries';

@Injectable({
    providedIn: 'root'
})
export class ArtistService
    extends AbstractModelService<ArtistQuery['artist'],
        ArtistsQuery['artists'],
        CreateArtistMutation['createArtist'],
        UpdateArtistMutation['updateArtist'],
        DeleteArtistsMutation['deleteArtists']> {

    constructor(apollo: Apollo) {
        super(apollo,
            'artist',
            artistQuery,
            artistsQuery,
            createArtistMutation,
            updateArtistMutation,
            deleteArtistsMutation);
    }

    public getEmptyObject(): ArtistInput {
        return {
            name: '',
        };
    }

}

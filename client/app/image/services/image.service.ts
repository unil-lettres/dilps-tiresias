import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import 'rxjs/add/observable/of';
import { merge } from 'lodash';
import {
    CreateImageMutation,
    DeleteImagesMutation,
    ImageInput,
    ImageQuery,
    ImagesQuery,
    ImageStatus,
    ImageType,
    UpdateImageMutation,
} from '../../shared/generated-types';
import { AbstractModelService } from '../../shared/services/abstract-model.service';
import { createImageMutation, deleteImagesMutation, imageQuery, imagesQuery, updateImageMutation, } from './imageQueries';
import { UtilityService } from '../../shared/services/utility.service';
import { Literal } from '../../shared/types';

@Injectable()
export class ImageService extends AbstractModelService<ImageQuery['image'],
    ImagesQuery['images'],
    CreateImageMutation['createImage'],
    UpdateImageMutation['updateImage'],
    DeleteImagesMutation['deleteImages']> {

    public static getImageFormat(image, height): any {
        height = Math.min(image.height, height);
        const ratio = image.width / image.height;
        return {
            height: height,
            width: height * ratio,
        };
    }

    public static formatImage(image, height) {
        const sizes = this.getImageFormat(image, height);
        const imageLink = '/image-src/' + image.id + '/';
        const fields = {src: imageLink + sizes.height};
        return merge({}, image, fields);
    }

    constructor(apollo: Apollo) {
        super(apollo, 'image', imageQuery, imagesQuery, createImageMutation, updateImageMutation, deleteImagesMutation);
    }

    public getEmptyObject(): ImageInput {
        return {
            file: null,
            dating: '',
            type: ImageType.default,
            status: ImageStatus.new,
            addition: '',
            expandedName: '',
            material: '',
            technique: '',
            techniqueAuthor: '',
            format: '',
            literature: '',
            page: '',
            figure: '',
            table: '',
            isbn: '',
            comment: '',
            rights: '',
            muserisUrl: '',
            muserisCote: '',
            name: '',
            isPublic: false,
            artists: [],
            street: '',
            postcode: '',
            locality: '',
            area: '',
        };
    }

    protected getInput(object: Literal): Literal {

        const input = super.getInput(object);

        // If file is undefined or null, prevent to send attribute to server
        if (!object.file) {
            delete input.file;
        }

        return input;
    }

}

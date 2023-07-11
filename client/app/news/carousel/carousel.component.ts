import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation} from '@angular/core';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {Newses, NewsesVariables} from '../../shared/generated-types';
import {NewsService} from '../services/news.service';
import {register} from 'swiper/element/bundle';
import {ExtendedModule} from '@ngbracket/ngx-layout/extended';
import {NgFor, NgIf, NgStyle} from '@angular/common';

// register Swiper custom elements
register();

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [NgIf, NgFor, NgStyle, ExtendedModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarouselComponent implements OnInit {
    public newses: Newses['newses']['items'][0][] = [];

    public constructor(public readonly newsService: NewsService) {}

    public ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<NewsesVariables>();
        qvm.set('search', {filter: {groups: [{conditions: [{isActive: {equal: {value: true}}}]}]}});

        this.newsService.getAll(qvm).subscribe(result => {
            this.newses = result.items;
        });
    }
}

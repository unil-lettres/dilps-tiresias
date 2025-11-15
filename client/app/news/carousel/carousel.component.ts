import {Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, ViewEncapsulation} from '@angular/core';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {Newses, NewsesVariables} from '../../shared/generated-types';
import {NewsService} from '../services/news.service';
import {register} from 'swiper/element/bundle';

// register Swiper custom elements
register();

@Component({
    selector: 'app-carousel',
    imports: [],
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.scss',
    // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
    encapsulation: ViewEncapsulation.None,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarouselComponent implements OnInit {
    protected readonly newsService = inject(NewsService);

    protected newses: Newses['newses']['items'][0][] = [];

    public ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<NewsesVariables>();
        qvm.set('search', {filter: {groups: [{conditions: [{isActive: {equal: {value: true}}}]}]}});

        this.newsService.getAll(qvm).subscribe(result => {
            this.newses = result.items;
        });
    }
}

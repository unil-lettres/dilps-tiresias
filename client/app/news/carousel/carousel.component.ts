import {Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation, inject} from '@angular/core';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {Newses, NewsesVariables} from '../../shared/generated-types';
import {NewsService} from '../services/news.service';
import {register} from 'swiper/element/bundle';
import {CommonModule} from '@angular/common';

// register Swiper custom elements
register();

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.scss',
    // eslint-disable-next-line @angular-eslint/use-component-view-encapsulation
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CarouselComponent implements OnInit {
    public readonly newsService = inject(NewsService);

    public newses: Newses['newses']['items'][0][] = [];

    public ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<NewsesVariables>();
        qvm.set('search', {filter: {groups: [{conditions: [{isActive: {equal: {value: true}}}]}]}});

        this.newsService.getAll(qvm).subscribe(result => {
            this.newses = result.items;
        });
    }
}

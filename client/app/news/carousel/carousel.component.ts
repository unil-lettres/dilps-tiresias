import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NaturalQueryVariablesManager} from '@ecodev/natural';
import {Newses, NewsesVariables} from '../../shared/generated-types';
import {NewsService} from '../services/news.service';
import {SwiperOptions} from 'swiper/types';
import SwiperCore, {Navigation} from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation]);

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class CarouselComponent implements OnInit {
    public swiperConfig: SwiperOptions = {
        direction: 'horizontal',
        autoplay: true,
        speed: 1000,
        a11y: {enabled: true},
        slidesPerView: 1,
        navigation: true,
    };

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

import { Component, OnInit } from '@angular/core';
import { NaturalQueryVariablesManager } from '@ecodev/natural';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { NewsesVariables } from '../../shared/generated-types';
import { NewsService } from '../services/news.service';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {

    public swiperConfig: SwiperConfigInterface = {
        direction: 'horizontal',
        autoplay: true,
        speed: 1000,
    };

    public slides;

    constructor(public newsService: NewsService) {
    }

    ngOnInit() {

        const qvm = new NaturalQueryVariablesManager<NewsesVariables>();
        this.newsService.getAll(qvm).subscribe(result => {

            this.slides = result.items.map(news => {
                /* tslint:disable */
                return 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyOTN9'; //news.imageUrl;
            });

        });

    }

}

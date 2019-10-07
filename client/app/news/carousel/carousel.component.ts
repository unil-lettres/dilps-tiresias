import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NaturalQueryVariablesManager } from '@ecodev/natural';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import Swiper from 'swiper';
import { NewsesVariables } from '../../shared/generated-types';
import { NewsService } from '../services/news.service';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {

    @ViewChild('swiper', {static: true}) swiperContainer: ElementRef;

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
                /* eslint-disable */
                return 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyOTN9'; //news.imageUrl;
            });

            const asdf = new Swiper(this.swiperContainer.nativeElement, {
                // pagination: '.swiper-pagination',
                // paginationClickable: true,
                // nextButton: '.swiper-button-next',
                // prevButton: '.swiper-button-prev',
                // autoplay: 3000,
                spaceBetween: 30,
            });
        });

    }

}

import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {SITE} from '../../app.config';
import {Site} from '../../shared/generated-types';
import {MOCK_APOLLO_PROVIDER} from '../../shared/testing/MOCK_APOLLO_PROVIDER';

import {CarouselComponent} from './carousel.component';

describe('CarouselComponent', () => {
    let component: CarouselComponent;
    let fixture: ComponentFixture<CarouselComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CarouselComponent],
            imports: [SwiperModule],
            providers: [MOCK_APOLLO_PROVIDER, {provide: SITE, useValue: Site.tiresias}],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {SITE} from '../../app.config';
import {Site} from '../../shared/generated-types';
import {MOCK_APOLLO_PROVIDER} from '../../shared/testing/MockApolloProvider';
import {CarouselComponent} from './carousel.component';

describe('CarouselComponent', () => {
    let component: CarouselComponent;
    let fixture: ComponentFixture<CarouselComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CarouselComponent],
            providers: [MOCK_APOLLO_PROVIDER, {provide: SITE, useValue: Site.tiresias}],
        }).compileComponents();

        fixture = TestBed.createComponent(CarouselComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

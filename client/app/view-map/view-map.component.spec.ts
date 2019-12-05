import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ViewMapComponent } from './view-map.component';

describe('ViewMapComponent', () => {
    let component: ViewMapComponent;
    let fixture: ComponentFixture<ViewMapComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ViewMapComponent],
            imports: [
                RouterTestingModule,
                AgmSnazzyInfoWindowModule,
                AgmCoreModule.forRoot({apiKey: 'asdf'}),
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ViewMapComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

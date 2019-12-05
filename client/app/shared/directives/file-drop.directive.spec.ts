import { Component } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { UploadService } from '../services/upload.service';
import { FileDropDirective } from './file-drop.directive';

@Component({
    template: '<div appFileDrop>foo bar</div>',
})
class ContainerComponent {
}

describe('FileDropDirective', () => {

    let fixture: ComponentFixture<ContainerComponent>;
    let component: any;
    let uploadSvc: UploadService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ContainerComponent,
                FileDropDirective,
            ],
            providers: [
                UploadService,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        // Mock current site
        inject([UploadService], (uploadService: UploadService) => {
            uploadSvc = uploadService;
        })();

    });

    it('should create an instance', ((done) => {
        expect(fixture).toBeTruthy();
        expect(component).toBeTruthy();

        const event: CustomEvent & { dataTransfer?: any } = new CustomEvent('dragover', {
            bubbles: true,
            cancelable: true,
        });
        event.dataTransfer = {
            files: [{type: 'image/png'}],
        };

        const element = fixture.nativeElement.childNodes[0];
        expect(element.className).toBe('');

        element.dispatchEvent(event);

        // While nobody listens to the uploadService.filesChanged, "over" class should not be there
        setTimeout(() => {
            expect(element.className).toBe('');

            // Subscribe to event
            uploadSvc.filesChanged.subscribe(() => {
            });
            element.dispatchEvent(event);

            // After a short while the class must have been changed
            setTimeout(() => {
                expect(element.className).toBe('app-file-drag-n-drop-file-over');
                done();
            }, 220);

        }, 220);

    }));
});

import {Directive, ElementRef, HostListener} from '@angular/core';
import {ngfDrop} from 'angular-file';
import {sampleTime} from 'rxjs/operators';
import {UploadService} from '../services/upload.service';

@Directive({
    selector: '[appFileDrop]',
})
export class FileDropDirective extends ngfDrop {
    constructor(element: ElementRef, private uploadService: UploadService) {
        super(element);

        const overlay: HTMLElement = document.createElement('div');
        overlay.classList.add('app-file-drag-n-drop-overlay');
        overlay.textContent = 'Glisser-déposer un fichier ici';
        element.nativeElement.appendChild(overlay);

        // Automatically change the class, but not too often to avoid visual flickering
        const fileOverClass = 'app-file-drag-n-drop-file-over';
        this.fileOver.pipe(sampleTime(100)).subscribe(fileOver => {
            if (fileOver) {
                element.nativeElement.classList.add(fileOverClass);
            } else {
                element.nativeElement.classList.remove(fileOverClass);
            }
        });

        this.filesChange.subscribe((data: File[]) => {
            uploadService.filesChanged.next(data);
        });
    }

    /**
     * Prevent drag and drop if disabled or if nobody is waiting for files
     */
    @HostListener('dragover', ['$event']) public onDragOver(event: Event): void {
        if (this.fileDropDisabled || this.uploadService.filesChanged.observers.length === 0) {
            return;
        }

        super.onDragOver(event);
    }
}

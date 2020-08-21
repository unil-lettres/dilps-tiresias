import {AfterViewInit, Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({
    selector: '[appFocus]',
})
export class FocusDirective implements AfterViewInit {
    constructor(public renderer: Renderer2, public elementRef: ElementRef) {}

    ngAfterViewInit() {
        setTimeout(() => this.elementRef.nativeElement.focus());
    }
}

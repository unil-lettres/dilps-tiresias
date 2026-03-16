import {ElementRef, Signal, effect, signal} from '@angular/core';

/**
 * Creates a readonly signal that emits the `offsetWidth` of the element
 * referenced by `elementRef` whenever it is resized.
 * The ResizeObserver is automatically disconnected when the element changes or
 * the owning context is destroyed.
 */
export function fromResize(elementRef: Signal<ElementRef | undefined>): Signal<number> {
    const width = signal(0);

    effect(onCleanup => {
        const el = elementRef()?.nativeElement;
        if (!el) return;

        const observer = new ResizeObserver(() => {
            width.set(el.offsetWidth);
        });

        observer.observe(el);
        onCleanup(() => observer.disconnect());
    });

    return width.asReadonly();
}

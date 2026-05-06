import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {NaturalIconDirective, NaturalQueryVariablesManager} from '@ecodev/natural';
import {NewsesQuery, NewsesQueryVariables} from '../../shared/generated-types';
import {NewsService} from '../services/news.service';

@Component({
    selector: 'app-carousel',
    imports: [NaturalIconDirective, MatIcon, MatIconButton],
    templateUrl: './carousel.component.html',
    styleUrl: './carousel.component.scss',
})
export class CarouselComponent implements OnInit, OnDestroy {
    protected readonly newsService = inject(NewsService);

    protected newses: NewsesQuery['newses']['items'][0][] = [];
    protected readonly currentIndex = signal(0);
    private autoplayInterval?: ReturnType<typeof setInterval>;

    public ngOnInit(): void {
        const qvm = new NaturalQueryVariablesManager<NewsesQueryVariables>();
        qvm.set('search', {filter: {groups: [{conditions: [{isActive: {equal: {value: true}}}]}]}});

        this.newsService.getAll(qvm).subscribe(result => {
            this.newses = result.items;
            if (this.newses.length > 0) {
                this.startAutoplay();
            }
        });
    }

    public ngOnDestroy(): void {
        this.stopAutoplay();
    }

    protected next(): void {
        this.currentIndex.update(index => (index + 1) % this.newses.length);
        this.resetAutoplay();
    }

    protected previous(): void {
        this.currentIndex.update(index => (index - 1 + this.newses.length) % this.newses.length);
        this.resetAutoplay();
    }

    protected goToSlide(index: number): void {
        this.currentIndex.set(index);
        this.resetAutoplay();
    }

    private resetAutoplay(): void {
        this.stopAutoplay();
        this.startAutoplay();
    }

    private startAutoplay(): void {
        this.autoplayInterval = setInterval(() => {
            this.next();
        }, 5000);
    }

    private stopAutoplay(): void {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}

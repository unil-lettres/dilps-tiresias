import {Component, Injector} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {NewsComponent} from '../news/news.component';
import {NewsService} from '../services/news.service';

@Component({
    selector: 'app-newses',
    templateUrl: './newses.component.html',
    styleUrls: ['./newses.component.scss'],
})
export class NewsesComponent extends AbstractList<NewsService> {
    public displayedColumns = ['isActive', 'image', 'name', 'url'];

    public constructor(service: NewsService, injector: Injector) {
        super(service, NewsComponent, injector);
    }
}

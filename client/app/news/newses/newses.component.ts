import {Component} from '@angular/core';
import {AbstractList} from '../../shared/components/AbstractList';
import {NewsComponent} from '../news/news.component';
import {NewsService} from '../services/news.service';

@Component({
    selector: 'app-newses',
    templateUrl: './newses.component.html',
    styleUrls: ['./newses.component.scss'],
})
export class NewsesComponent extends AbstractList<NewsService> {
    public override displayedColumns = ['isActive', 'image', 'name', 'url'];

    public constructor(service: NewsService) {
        super(service, NewsComponent);
    }
}

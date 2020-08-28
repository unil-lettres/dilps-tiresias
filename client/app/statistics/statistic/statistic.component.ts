import {Component, Input} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import * as Highcharts from 'highcharts';

interface Row {
    name: string;
    value: number;
}

interface Table {
    name: string;
    rows: Row[];
}

interface SimpleChart {
    name: string;
    series: any[];
    categories: string[];
}

export interface StatisticInput {
    tables: Table[];
    chart: SimpleChart;
}

type RowPercent = {
    percent: number;
} & Row;

interface TableSource {
    name: string;
    dataSource: MatTableDataSource<RowPercent>;
}

function percent(count: number, total: number): number {
    if (total === 0) {
        return 0;
    }

    return count / total;
}

@Component({
    selector: 'app-statistic',
    templateUrl: './statistic.component.html',
    styleUrls: ['./statistic.component.scss'],
})
export class StatisticComponent {
    @Input()
    public set input(val: StatisticInput) {
        if (!val) {
            return;
        }

        this.update(val.chart);

        this.tables = val.tables.map(table => {
            const total = table.rows.reduce((t, r) => t + r.value, 0);
            const rowPercent = table.rows.map(r => {
                return {...r, percent: percent(r.value, total)};
            });

            // Insert total line
            rowPercent.push({
                name: 'Total',
                value: total,
                percent: percent(total, total),
            });

            return {
                name: table.name,
                dataSource: new MatTableDataSource<RowPercent>(rowPercent),
            };
        });
    }

    public displayedColumns = ['name', 'absolute', 'percent'];
    public tables: TableSource[];
    public Highcharts: typeof Highcharts = Highcharts;
    public chartOptions: Highcharts.Options = {
        series: [],
    };
    public chartUpdated = false;

    constructor() {}

    public update(chart: SimpleChart): void {
        this.chartOptions = {
            chart: {
                type: 'column',
            },
            title: {
                text: chart.name,
            },
            xAxis: {
                categories: chart.categories,
            },
            yAxis: {
                min: 0,
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                },
            },
            series: chart.series,
        };

        this.chartUpdated = true;
    }
}

import {Component, Input} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import Highcharts from 'highcharts/es-modules/masters/highcharts.src.js';
import {CommonModule} from '@angular/common';
import {HighchartsChartModule} from 'highcharts-angular';

type Row = {
    name: string;
    value: number;
};

type Table = {
    name: string;
    rows: Row[];
};

type SimpleChart = {
    name: string;
    series: any[];
    categories: string[];
};

export type StatisticInput = {
    tables: Table[];
    chart: SimpleChart;
};

type RowPercent = {
    percent: number;
} & Row;

type TableSource = {
    name: string;
    dataSource: MatTableDataSource<RowPercent>;
};

function percent(count: number, total: number): number {
    if (total === 0) {
        return 0;
    }

    return count / total;
}

@Component({
    selector: 'app-statistic',
    templateUrl: './statistic.component.html',
    styleUrl: './statistic.component.scss',
    imports: [HighchartsChartModule, CommonModule, MatTableModule],
})
export class StatisticComponent {
    @Input({required: true})
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
    public tables: TableSource[] = [];
    public Highcharts: typeof Highcharts = Highcharts;
    public chartOptions: Highcharts.Options = {
        series: [],
    };
    public chartUpdated = false;

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

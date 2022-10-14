import { Component, OnInit, ViewChild, OnChanges, SimpleChanges, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as HighCharts from 'highcharts';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {
  @Input('tableData') tableData: any[] = [];
  @Input('graphData') graphData: any[] = [];

  tableDataSource!: MatTableDataSource<any>;
  tableColumns: string[] = [
    'name',
    'company',
    'batch',
    'stock',
    'deal',
    'free',
    'mrp',
    'rate',
    'exp',
  ];
  showTable : boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  areaChartOptions: any;
  barChartOptions: any;
  rangeChartOptions: any;
  areaSplineChartOptions : any;

  HighCharts: typeof HighCharts = HighCharts;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['tableData']) {
      this.tableDataSource = new MatTableDataSource(this.tableData);
      this.areaChartOptions = {
        colors: ['#083aa9'],
        chart: {
          type: 'area',
          zoomType: 'x',
          scrollablePlotArea: {
            minWidth: 600,
            scrollPositionX: 1,
          },
        },
        title: {
          text: 'Day Wise Stocks in Expiry Date',
        },
        xAxis: {
          categories: Object.keys(this.graphData[0]),
          title: {
            text: 'Date',
          },
        },

        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, '#2051be'],
                [1, HighCharts.color('#2051be').setOpacity(0).get('rgba')],
              ],
            },
            marker: {
              radius: 2,
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            threshold: null,
          },
        },

        series: [
          {
            data: Object.values(this.graphData[0]),
          },
        ],
      };
      this.barChartOptions = {
        colors: ['#083aa9', '#ff0000'],
        chart: {
          type: 'column',
          zoomType: 'x',
          scrollablePlotArea: {
            minWidth: 600,
            scrollPositionX: 1,
          },
        },
        title: {
          text: 'Mrp VS Rate',
        },
        xAxis: {
          categories: Object.keys(this.graphData[1]),
          title: {
            text: 'Date',
          },
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            name: 'MRP',
            data: Object.values(this.graphData[2]),
          },
          {
            name: 'Rate',
            data: Object.values(this.graphData[1]),
          },
        ],
      };
      this.rangeChartOptions = {
        colors: ['#083aa9'],
        chart: {
          type: 'line',
        },
        title: {
          text: 'Day Wise Stocks in Expiry Date',
        },
        xAxis: {
          categories: Object.keys(this.graphData[0]),
          title: {
            text: 'Date',
          },
        },

        series: [
          {
            data: Object.values(this.graphData[0]),
          },
        ],
      };
      this.areaSplineChartOptions = {
        chart: {
          type: 'line',
          zoomType: 'x',
          scrollablePlotArea: {
            minWidth: 600,
            scrollPositionX: 1,
          },
        },
        title: {
          text: 'Mrp VS Rate',
        },
        xAxis: {
          categories: Object.keys(this.graphData[0]),
          title: {
            text: 'Date',
          },
        },

        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1,
              },
              stops: [
                [0, '#2051be'],
                [1, HighCharts.color('#2051be').setOpacity(0).get('rgba')],
              ],
            },
            marker: {
              radius: 2,
            },
            lineWidth: 1,
            states: {
              hover: {
                lineWidth: 1,
              },
            },
            threshold: null,
          },
        },

        series: [
          {
            name: 'MRP',
            data: Object.values(this.graphData[2]),
          },
          {
            name: 'Rate',
            data: Object.values(this.graphData[1]),
          },
        ],
      };
    }
  }

  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }
}

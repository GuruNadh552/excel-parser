import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  excelData: any = [];
  isUploaded: boolean = false;
  graphData : any = [];

  constructor(
    private _cdf: ChangeDetectorRef,
    private _notifyService: NotifierService
  ) {}

  @ViewChild('fileInputRef') fileInputRef!: ElementRef;

  triggerFileUpload() {
    this.fileInputRef.nativeElement.value = null;
    this.fileInputRef.nativeElement.click();
  }

  parseExcel(event: any) {
    if (event.files.length == 1) {
      this._notifyService.notify('warning', 'Parsing Excel File...');
      const file = event.files[0];
      const fileReader = new FileReader();
      fileReader.readAsBinaryString(file);
      fileReader.onload = () => {
        const workBook = XLSX.read(fileReader.result, {
          type: 'binary',
          cellDates: true,
          cellText: false,
        });
        const workSheets = workBook.SheetNames;
        const data = XLSX.utils.sheet_to_json(workBook.Sheets[workSheets[0]], {
          dateNF: 'dd/mm/yyyy',
          raw: false,
        });
        this.excelData = this.formatTableData(data);
        this.isUploaded = true;
        this._notifyService.hideAll();
        this._notifyService.notify('success', 'Data Loaded Successfully...');
        this._cdf.detectChanges();
      };
    } else
      this._notifyService.notify('warning', 'Please Upload a Single File...');
  }

  formatTableData(data: any) {
    const barChartData : any = {};
    const mrpData: any = {};
    const rateData: any = {};
    const result = Object.values(
      [...data].reduce(
        (
          acc,
          { code, stock, deal, free, mrp, rate, exp, name, batch, company }
        ) => {
          acc[code] = {
            code,
            stock: (acc[code] ? acc[code].stock : 0) + Number(stock),
            deal: acc[code]
              ? acc[code].deal > Number(deal)
                ? Number(deal)
                : acc[code].deal
              : Number(deal),
            free: acc[code]
              ? acc[code].free > Number(free)
                ? Number(free)
                : acc[code].free
              : Number(free),
            mrp: acc[code] ? (acc[code].mrp < Number(mrp) ? Number(mrp) : acc[code].mrp) : Number(mrp),
            rate: acc[code]
              ? acc[code].rate < Number(rate)
                ? Number(rate)
                : acc[code].rate
              : Number(rate),
            exp: acc[code]
              ? moment(acc[code].exp) > moment(exp)
                ? exp
                : acc[code].exp
              : exp,
            name: name,
            company: company,
            batch: acc[code] && acc[code].batch ? 'All' : batch,
          };
          barChartData[exp] = barChartData[exp] ? (barChartData[exp] + Number(stock)) : Number(stock);
          rateData[exp] = rateData[exp]
            ? rateData[exp] + Number(rate)
            : Number(rate);
          mrpData[exp] = mrpData[exp]
            ? mrpData[exp] + Number(mrp)
            : Number(mrp);
          return acc;
        },
        {}
      )
    );
    this.graphData = [barChartData, rateData, mrpData];
    return result;
  }
}

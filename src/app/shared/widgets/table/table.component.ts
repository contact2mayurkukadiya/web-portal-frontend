import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output, TemplateRef
} from '@angular/core';
import { TableConfig } from '@models';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {

  @Input() Config: TableConfig;
  @Input() Data: Array<any> = [];
  @Input() Mode: 'View' | 'Normal' = 'Normal';
  @Input() ExtraHeaderButtons: TemplateRef<any>;
  @Input() TotalItems: number = 500;
  @Input() PageIndex: number = 1;
  @Input() PageSize: number = 10;
  // @Input() ScrollConfig: any = { x: 'auto' };
  @Input() loading: boolean = false;

  @Output() onCellClick: EventEmitter<any> = new EventEmitter();
  @Output() onRowClick: EventEmitter<any> = new EventEmitter();
  @Output() onRowSelect: EventEmitter<any> = new EventEmitter();
  @Output() onSearchColumn: EventEmitter<any> = new EventEmitter();
  @Output() onSortColumn: EventEmitter<any> = new EventEmitter();
  @Output() header_searchClick: EventEmitter<any> = new EventEmitter();
  @Output() header_addClick: EventEmitter<any> = new EventEmitter();
  @Output() header_resetClick: EventEmitter<any> = new EventEmitter();
  @Output() header_closeClick: EventEmitter<any> = new EventEmitter();
  @Output() header_downloadClick: EventEmitter<any> = new EventEmitter();
  @Output() header_uploadClick: EventEmitter<any> = new EventEmitter();
  @Output() pageIndex: EventEmitter<any> = new EventEmitter();
  @Output() sortTableColumn: EventEmitter<any> = new EventEmitter();

  clickedRowIndex: number;
  selectAll: Boolean = false;

  public readonly tableId = Math.round(Math.random() * 10000000000) + Date.now();
  public readonly resizableEdge = { top: false, bottom: false, left: true, right: true, };
  public readonly defaultMaskDate = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  @Input() sorting: boolean = false;
  resizing: boolean = false;

  constructor() { }

  ngOnInit(): void { }

  trackBy(index: number): number {
    return index;
  }

  selectRow(index: any, data: any) {
    this.onRowClick.emit({ index, data });
    this.clickedRowIndex = index;
  }

  emitTableCellClick($event: any, row: any, column: any, rowIndex: any, columnIndex: any) {
    $event.stopPropagation();
    this.onCellClick.emit({ row, column, rowIndex, columnIndex });
  }

  getData(row: any, column: any) {
    return row[column.property];
  }

  uncheckSelectAll(selected: any) {
    if (selected == true) {
      if (!this.Data.find((item) => { return !item.selected; })) {
        this.selectAll = true;
      }
    } else {
      this.selectAll = false;
    }
    this.onRowSelect.emit(
      this.Data.filter((item) => {
        return item.selected;
      })
    );
  }

  // searchInput(searchQuery: any, index: any) {
  //   console.log('event: ', searchQuery);
  //   if (this.Config.SearchType == 'Dynamic') {
  //     /* Emit searching event to the page to `get sorted  data from API` */
  //     this.onSearchColumn.emit({
  //       index,
  //       column: this.Config.Columns[index],
  //       query: searchQuery,
  //     });
  //   } else {
  //     /* Handle Static Search */
  //   }
  // }

  sortColumnChanges(index: any) {
    if (this.Config.SortingType == 'Dynamic') {
      /* Emit sorting event to the page to `get sorted data from API` */
      this.onSortColumn.emit({ index, column: this.Config.Columns[index] });
    } else {
      /* Sort data here that is displayed in table widgets */
    }
  }

  search(event) {
    this.header_searchClick.emit(event);
  }

  add() {
    this.header_addClick.emit();
  }

  reset() {
    this.header_resetClick.emit();
  }

  close() {
    this.header_closeClick.emit();
  }

  upload() {
    this.header_uploadClick.emit();
  }

  download() {
    if (this.Config.rowSelectable == true) {
      const records = this.Data.filter((item) => {
        return item.selected;
      });
      this.header_downloadClick.emit({ Data: this.Data, Selected: records });
    } else {
      this.header_downloadClick.emit({ Data: this.Data, Selected: [] });
    }
  }

  addBtn() {
    this.header_addClick.emit();
  }

  /*  onResizeEnd(event: ResizeEvent, columnIndex: any) {
    // console.log("onResizeEnd", event, columnIndex, `data_column_${this.tableId}_${columnIndex}`);
    const childWidth = event.rectangle.width;
    const rowsElements = document.getElementsByClassName(
      `data_column_${this.tableId}_${columnIndex}`
    );
    const headerElements = document.getElementsByClassName(
      `header_column_${this.tableId}_${columnIndex}`
    );
    const filterElements = document.getElementsByClassName(
      `filter_column_${this.tableId}_${columnIndex}`
    );

    // console.log("row change", rowsElements, childWidth);
    for (let i = 0; i < rowsElements.length; i++) {
      const currentEl = rowsElements[i] as HTMLDivElement;
      currentEl.style.width = childWidth + 'px';
    }
    for (let i = 0; i < headerElements.length; i++) {
      const currentEl = headerElements[i] as HTMLDivElement;
      currentEl.style.width = childWidth + 'px';
    }
    for (let i = 0; i < filterElements.length; i++) {
      const currentEl = filterElements[i] as HTMLDivElement;
      currentEl.style.width = childWidth + 'px';
    }
  } */

  pageIndexChanged(event) {
    this.pageIndex.emit(event);
  }

  sortColumn(event, property) {
    let sortData = {
      sort_property: property,
      sort_order: event,
    }
    this.sortTableColumn.emit(sortData)
  }

  onResize({ width }: NzResizeEvent, col: string): void {
    this.Config['Columns'] = this.Config['Columns'].map(e => (e['property'] === col ? { ...e, Width: `${width}px` } : e));
    this.resizing = false;
  }
}

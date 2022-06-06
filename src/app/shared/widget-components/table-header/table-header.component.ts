import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'wic-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
})
export class TableHeaderComponent implements OnInit {
  @Input() Columns: any;
  @Input() Header: any;
  @Input() Caption: any;
  @Input() ExtraButtons: TemplateRef<any>;
  @Input() ExtraButtonContext: any = {};

  @Output() searchClick: EventEmitter<any> = new EventEmitter();
  @Output() addClick: EventEmitter<any> = new EventEmitter();
  @Output() resetClick: EventEmitter<any> = new EventEmitter();
  @Output() closeClick: EventEmitter<any> = new EventEmitter();
  @Output() downloadClick: EventEmitter<any> = new EventEmitter();
  @Output() uploadClick: EventEmitter<any> = new EventEmitter();

  searchedValue: any;

  constructor() { }

  ngOnInit(): void { }

  toggleColumn(i: any) {
    // event.stopPropagation();
    this.Columns[i].visible = !this.Columns[i].visible;
    // this.changeDetectorRef.markForCheck();
  }

  search() {
    setTimeout(() => {
      this.searchClick.emit(this.searchedValue);
    }, 500);
  }

  add() {
    this.addClick.emit();
  }

  reset() {
    this.resetClick.emit();
  }

  close() {
    this.closeClick.emit();
  }

  download() {
    this.downloadClick.emit();
  }

  upload() {
    this.uploadClick.emit();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.scss'],
})
export class TablePaginationComponent implements OnInit {
  @Input() pageSize: number;
  @Input() pageIndex: number;
  @Input() boundaryLinks: boolean = true;
  @Input() pageDisplaySize: number = 7;
  @Input() TotalItems: number;
  @Input() pageSizeChanger: boolean = true;

  @Output() pageChange = new EventEmitter();
  @Output() pageSizeChange = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}

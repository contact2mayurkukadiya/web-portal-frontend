import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-export-history',
  templateUrl: './export-history.component.html',
  styleUrls: ['./export-history.component.scss']
})
export class ExportHistoryComponent implements OnInit {
  deviceList: any;
  constructor(private modalService: NzModalService) { }

  ngOnInit(): void {
  }

  onClose() {
    this.modalService.closeAll();
  }
}

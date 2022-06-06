import { Component, Input, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DEVICE_CONST } from '../../constants/notifications.constant';
import { DeviceService } from '../../services/device.service';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.scss']
})

export class DeviceListComponent implements OnInit {

  @Input() account_id: any;
  isConfirmLoading: boolean = false;
  deviceList: any = [];
  licence_Key: any;
  updated_status: boolean = false;
  product_Key: any;
  host_name: any;

  constructor(private modalService: NzModalService, private deviceService: DeviceService, private notification: NzNotificationService) { }

  ngOnInit(): void {
    this.getAllDevices(this.account_id);
  }

  getAllDevices(account_id) {
    let data = {
      offset: 0,
      limit: 30,
      account_id: account_id
    }
    this.deviceService.getAllDevices(data).subscribe((result: any) => {
      if (result.success == true) {
        this.deviceList = result.data;
        this.deviceList.map((element) => {
          element['is_edit_mode'] = false;
        })
      }
    })
  }

  onClose() {
    this.isConfirmLoading = false;
    this.modalService.closeAll();
  }

  updateDevice(data) {
    let api_data = {
      licencekey: this.licence_Key,
      status: this.updated_status
    }
    this.editStatus(data);
    this.deviceService.updateDevice(data.id, api_data).subscribe((result: any) => {
      if (result.success == true) {
        data.licencekey = this.licence_Key;
        data.status = this.updated_status;
        this.notification.create('success', DEVICE_CONST.update_device_success, '', { nzDuration: 6000, nzPauseOnHover: true })
      }
    }, (_error) => {
      this.notification.create('error', DEVICE_CONST.update_device_error, '', { nzDuration: 6000, nzPauseOnHover: true })
    })
  }

  deleteDevice(id) {
    this.deviceService.deleteDevice(id).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.deviceList = this.deviceList.filter((element) => element['id'] !== id);
        this.notification.create('success', DEVICE_CONST.delete_device_success, '', { nzDuration: 6000, nzPauseOnHover: true });
      }
    }, (_error) => {
      this.notification.create('error', DEVICE_CONST.delete_device_error, '', { nzDuration: 6000, nzPauseOnHover: true });
    })
  }

  showDeleteConfirm(id: any): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this device?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteDevice(id),
      nzCancelText: 'No',
    });
  }

  editStatus(data, status: boolean = false) {
    data.is_edit_mode = status;
  }

  editRow(data, status) {
    this.editStatus(data, status);
    this.licence_Key = data.licencekey;
    this.updated_status = data.status;
    this.product_Key = data.productkey;
    this.host_name = data.hostname;
  }
}

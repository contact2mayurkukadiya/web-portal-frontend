import { Injectable } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private notifcation: NzNotificationService) {}

  success(message: any) {
    this.notifcation.create('success', '', message);
  }
  error(message: any) {
    this.notifcation.create('error', '', message);
  }
  info(message: any) {
    this.notifcation.create('info', '', message);
  }
  warning(message: any) {
    this.notifcation.create('warning', '', message);
  }
}

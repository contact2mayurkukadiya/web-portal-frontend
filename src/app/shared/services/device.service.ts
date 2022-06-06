import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APP_CONST } from '../constants/app.constant';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http: HttpClient) { }

  getAllDevices(data) {
    let url = `/device/getAllDevices`;
    return this.http.post(`${APP_CONST.ServerUrl}${url}`, data);
  }

  updateDevice(id, data) {
    let url = `/device/updateDevice/${id}`;
    return this.http.put(`${APP_CONST.ServerUrl}${url}`, data);
  }

  deleteDevice(id) {
    let url = `/device/deleteDevice/${id}`;
    return this.http.delete(`${APP_CONST.ServerUrl}${url}`);
  }
}

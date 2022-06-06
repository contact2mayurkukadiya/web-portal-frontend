import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APP_CONST } from '@constants';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  async GET(url) {
    return await this.http.get(`${APP_CONST.ServerUrl}${url}`).toPromise()
  }

  async POST(url, body) {
    return await this.http.post(`${APP_CONST.ServerUrl}${url}`, body).toPromise()
  }

  async PUT(url, body) {
    return await this.http.put(`${APP_CONST.ServerUrl}${url}`, body).toPromise()
  }

  async DELETE(url) {
    return await this.http.delete(`${APP_CONST.ServerUrl}${url}`).toPromise()
  }
}

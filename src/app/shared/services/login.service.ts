import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private dataService: DataService) { }

  LogIn(data: any) {
    return this.dataService.POST('/auth/adminLogin', data);
  }
}

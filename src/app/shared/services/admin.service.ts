import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  constructor(private dataService: DataService) { }

  getAllAdmin(data: any) {
    return this.dataService.POST('/admin/getAllAdminByRoleIdAndCreatedId', data);
  }

  createAdmin(data: any) {
    return this.dataService.POST('/admin/createAdminUser', data);
  }

  deleteAdmin(id) {
    return this.dataService.DELETE(`/admin/deleteAdminById/${id}`);
  }

  updateAdmin(id, data) {
    return this.dataService.PUT(`/admin/updateAdminById/${id}`, data);
  }
}

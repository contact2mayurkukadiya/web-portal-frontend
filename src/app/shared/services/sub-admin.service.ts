import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class SubAdminService {

  constructor(private dataService: DataService) { }

  getAllSubAdmin(data: any) {
    return this.dataService.POST('/admin/getAllAdminByRoleIdAndCreatedId', data);
  }

  createSubAdmin(data: any) {
    return this.dataService.POST('/admin/createAdminUser', data);
  }

  deleteSubAdmin(id) {
    return this.dataService.DELETE(`/admin/deleteAdminById/${id}`);
  }

  updateSubAdmin(id, data) {
    return this.dataService.PUT(`/admin/updateAdminById/${id}`, data);
  }

  updatePermissions(id, data) {
    return this.dataService.PUT(`/admin/updateViewAccountPermission/${id}`, data);
  }
}

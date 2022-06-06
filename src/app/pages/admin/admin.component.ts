import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { adminTableConfigJSON } from "@configJson";
import { APP_CONST } from '@constants';
import { AdminService, NotificationService } from '@services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ADMIN_CONST } from 'src/app/shared/constants/notifications.constant';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  @ViewChild('actionTemplate') actionTemplate: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate: TemplateRef<any>;
  @ViewChild('adminName', { static: false }) adminName: ElementRef;
  adminTableJSON: any = JSON.parse(JSON.stringify((adminTableConfigJSON as any)));

  // listOfData: Array<{ name: string; age: number; address: string }> = [];
  adminList: Array<any>;
  isSubAdminVisible: boolean = false;
  isAccountsVisible: boolean = false;
  adminForm: FormGroup;
  matchPasswordErr: boolean = false;
  currentUserDetails: any;
  mode: string = 'add';

  // When click on particular admin
  selectedAdminIdForSubAdmin: string = null;
  selectedAdminIdForAccounts: string = null;
  loading: boolean = true;
  totalData: number = 10;
  PageSize: number = 10;
  pag_params: any = { pageIndex: 1, pageSize: 10 };
  adminRole: any = APP_CONST.Role.Admin;
  search_keyword: any = '';
  default_sort_property: string = 'created_at';
  default_sort_order: any = 'desc';

  constructor(
    private modalService: NzModalService,
    private adminService: AdminService,
    private notification: NotificationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getDefaults();
    this.createForm();
    this.getAdminData();
  }

  getDefaults() {
    let current_user_details: any = localStorage.getItem('current_user_details');
    this.currentUserDetails = JSON.parse(current_user_details);
    setTimeout(() => {
      this.adminTableJSON.Columns.map((column: any) => {
        if (column.property == 'actions') {
          column.actionTemplate = this.actionTemplate;
        } else if (column.property == 'status') {
          column.actionTemplate = this.statusTemplate
        }
      });
    }, 0);
  }

  createForm() {
    /* this.adminForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required),
      status: new FormControl(1),
      role: new FormControl(this.adminRole),
    }); */
    this.adminForm = this.formBuilder.group(
      {
        firstname: [null, [Validators.required]],
        lastname: [null, [Validators.required]],
        email: [null, [Validators.required]],
        password: [null, [Validators.required]],
        confirmPassword: [null, [Validators.required]],
        company: [null, [Validators.required]],
        street: [null, [Validators.required]],
        state: [null, [Validators.required]],
        postcode: [null, [Validators.required]],
        status: [1],
        role: [this.adminRole],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      })
  }

  getAdminData(paginationParams = this.pag_params, sort_property = this.default_sort_property, sort_order = this.default_sort_order, search_query = this.search_keyword) {
    this.loading = true;
    let offset = (paginationParams.pageIndex - 1) * paginationParams.pageSize;
    let api_body = {
      created_by: this.currentUserDetails.id,
      role: this.adminRole,
      offset: offset,
      limit: paginationParams.pageSize,
      search_query: search_query
    }
    if (sort_order !== null) {
      sort_order = sort_order == 'ascend' ? 'ASC' : 'DESC';
      api_body['order'] = {
        [sort_property]: sort_order
      }
    }
    this.adminService.getAllAdmin(api_body).then((response: any) => {
      if (response.success) {
        this.adminList = response.data;
        this.adminList.map((element, index) => {
          element['sr_no'] = index + 1;
        });
        this.loading = false;
        this.totalData = response?.counts;
        this.PageSize = response?.limit ? response?.limit : 10;
      }
    }, (_error) => {
      this.loading = false;
      this.notification.error(ADMIN_CONST.get_admin_error);
    });
  }

  handleAdminRowClick({ data, index }) {
    this.handleSubAdmin(data);
    this.handleAccounts(data);
  }

  handleSubAdmin(data) {
    this.selectedAdminIdForSubAdmin = data.id;
    this.isSubAdminVisible = true;
  }

  handleAccounts(data) {
    this.selectedAdminIdForAccounts = data.id;
    this.isAccountsVisible = true;
  }

  openModal(temp: TemplateRef<{}>, state: any, item: any) {
    this.mode = state;
    setTimeout(() => {
      this.adminName.nativeElement.focus();
    });
    this.createForm();
    if (state == 'add') {
      this.modalService.create({
        nzTitle: 'Add New Admin',
        nzContent: temp,
        nzFooter: [
          {
            label: 'Save',
            type: 'primary',

            onClick: () => this.createAdmin(),
          },
        ],
        nzWidth: '80%',
        nzMaskClosable: false,
        nzOnCancel: () => this.onClose(),
        nzAutofocus: null,
      });
    } else {
      this.editAdmin(item);
      this.modalService.create({
        nzTitle: 'Update Admin',
        nzContent: temp,
        nzFooter: [
          {
            label: 'Update',
            type: 'primary',

            onClick: () => this.updateAdmin(item),
          },
        ],
        nzWidth: '80%',
        nzMaskClosable: false,
        nzOnCancel: () => this.onClose(),
        nzAutofocus: null,
      });
    }
  }

  editAdmin(item) {
    this.adminForm.patchValue({
      username: item.username,
      firstname: item.firstname,
      lastname: item.lastname,
      company: item.company,
      postcode: item.postcode,
      email: item.email,
      street: item.street,
      state: item.state
    });
    this.adminForm.get('password').clearValidators();
    this.adminForm.get('password').updateValueAndValidity();
  }

  onClose() {
    this.modalService.closeAll();
  }

  showDeleteConfirm(row_id: any): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this admin?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteAdmin(row_id),
      nzCancelText: 'No',
      nzOnCancel: () => this.onClose(),
    });
  }

  deleteAdmin(admin_id) {
    this.adminService.deleteAdmin(admin_id).then(
      (response: any) => {
        if (response.success) {
          this.adminList = this.adminList.filter((element) => element['id'] !== admin_id);
          this.adminList.map((element, index) => {
            element['sr_no'] = index + 1;
          });
          this.notification.success(ADMIN_CONST.delete_admin_success);
        }
      }, (_error) => {
        this.notification.error(ADMIN_CONST.delete_admin_error);
      });
  }

  createAdmin() {
    for (const i in this.adminForm.controls) {
      this.adminForm.controls[i].markAsDirty();
      this.adminForm.controls[i].updateValueAndValidity();
    }
    if (this.adminForm.valid && !this.matchPasswordErr) {
      const formObj = this.adminForm.value;
      this.adminService.createAdmin(formObj).then(
        (response: any) => {
          if (response.success) {
            this.adminList = [response['data'], ...this.adminList];
            this.adminList.map((element, index) => {
              element['sr_no'] = index + 1;
            });
            this.modalService.closeAll();
            this.notification.success(ADMIN_CONST.create_admin_success);
          }
        },
        (_error) => {
          this.notification.error(ADMIN_CONST.create_admin_error);
          this.modalService.closeAll();
        }
      );
    }
  }

  updateAdmin(item) {
    const formObj = this.adminForm.value;
    let data = {
      firstname: formObj.firstname,
      lastname: formObj.lastname,
      company: formObj.company,
      street: formObj.street,
      state: formObj.state,
      postcode: formObj.postcode,
      email: formObj.email,
    }
    if (formObj.password !== null) data['password'] = formObj.password;
    this.adminService.updateAdmin(item.id, data).then((response: any) => {
      if (response.success == true) {
        this.adminList = this.adminList.map((element, index) => {
          if (element['id'] == item.id) {
            element = response['data'];
            element['sr_no'] = index + 1;
          }
          return element;
        });
        this.notification.success(ADMIN_CONST.update_admin_success);
        this.modalService.closeAll();
      }
    }, (_error) => {
      this.notification.error(ADMIN_CONST.update_admin_error);
      this.modalService.closeAll();
    });
  }

  statusChanged(event, row_data, key) {
    row_data[key] = event == true ? 1 : 0;
    this.adminService.updateAdmin(row_data.id, row_data).then((response: any) => {
      this.adminList.map((element) => {
        if (element['id'] == row_data.id) {
          element = response['data'];
        }
      });
      this.notification.success(ADMIN_CONST.status_update_success);
    }, (_error) => {
      this.notification.error(ADMIN_CONST.status_update_error);
    })
  }

  sortAdminTable(event) {
    this.getAdminData(this.pag_params, event.sort_property, event.sort_order,);
  }

  search(keyword) {
    this.search_keyword = keyword;
    this.getAdminData(this.pag_params, this.default_sort_property, this.default_sort_order, this.search_keyword);
  }

  indexChanged(event) {
    this.pag_params['pageIndex'] = event;
    this.getAdminData(this.pag_params);
  }

  matchPassword() {
    this.matchPasswordErr = false;
    if (
      this.adminForm.controls['password'].value !==
      this.adminForm.controls['confirmPassword'].value &&
      this.adminForm.controls['confirmPassword'].value !== ''
    ) {
      this.matchPasswordErr = true;
    }
  }
}

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
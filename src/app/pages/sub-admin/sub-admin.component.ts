import { Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { subAdminTableConfigJSON } from '@configJson';
import { APP_CONST } from '@constants';
import { NotificationService, SubAdminService } from '@services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SUB_ADMIN_CONST } from 'src/app/shared/constants/notifications.constant';
@Component({
  selector: 'app-sub-admin',
  templateUrl: './sub-admin.component.html',
  styleUrls: ['./sub-admin.component.scss'],
})
export class SubAdminComponent implements OnInit {
  @ViewChild('actionTemplate') actionTemplate: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate: TemplateRef<any>;
  @ViewChild('firstName', { static: false }) firstname: ElementRef;

  @Output() close: EventEmitter<any> = new EventEmitter();

  subAdminTableJSON: any = JSON.parse(JSON.stringify((subAdminTableConfigJSON as any)));

  subAdminList: Array<any>;

  isAccountsVisible: boolean = false;
  subAdminForm: FormGroup;
  matchPasswordErr: boolean = false;
  currentUserDetails: any;
  mode: string = 'add';

  selectedSubAdminId: string;
  pag_params: any = { pageIndex: 1, pageSize: 10 };
  totalData: number = 10;
  PageSize: number = 10;
  loading: boolean = true;
  search_keyword: any = '';
  default_sort_property: string = 'created_at';
  default_sort_order: any = 'desc';
  subAdminRole: any = APP_CONST.Role.SubAdmin;

  constructor(
    private modalService: NzModalService,
    private subAdminService: SubAdminService,
    private notification: NotificationService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    let current_user_details: any = localStorage.getItem('current_user_details');
    this.currentUserDetails = JSON.parse(current_user_details);
    this.getDefaults();
    this.createForm();
    this.getSubAdminData();
  }

  /* ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.selectedAdminId.currentValue) {
      this.getSubAdminData();
    }
  } */

  getDefaults() {
    this.subAdminTableJSON.Header.showClose = false;
    this.subAdminTableJSON.Header.showAdd = true;

    setTimeout(() => {
      this.subAdminTableJSON.Columns.map((column: any) => {
        if (column.property == 'actions') {
          column.actionTemplate = this.actionTemplate;
        } else if (column.property == 'status') {
          column.actionTemplate = this.statusTemplate;
        }
      });
    }, 0);
  }

  createForm() {
    /* this.subAdminForm = new FormGroup({
      firstname: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required),
      status: new FormControl(1),
      role: new FormControl(this.subAdminRole),
      created_by: new FormControl(this.currentUserDetails.id),
    }); */
    this.subAdminForm = this.formBuilder.group(
      {
        firstname: [null, [Validators.required]],
        lastname: [null, [Validators.required]],
        email: [null, Validators.required],
        company: [null, [Validators.required]],
        street: [null, [Validators.required]],
        state: [null, [Validators.required]],
        postcode: [null, [Validators.required]],
        password: [null, [Validators.required]],
        confirmPassword: [null, [Validators.required]],
        status: [1],
        role: [this.subAdminRole],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      })
  }

  getSubAdminData(paginationParams = this.pag_params, sort_property = this.default_sort_property, sort_order = this.default_sort_order, search_query = this.search_keyword) {
    this.loading = true;
    const currentUserId = localStorage.getItem('current_user_id');
    let offset = (paginationParams.pageIndex - 1) * paginationParams.pageSize;
    // sort_order = sort_order == 'ascend' ? 'ASC' : 'DESC';
    let api_body = {
      created_by: currentUserId,
      role: this.subAdminRole,
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
    this.subAdminService.getAllSubAdmin(api_body).then((response: any) => {
      if (response.success) {
        this.subAdminList = response.data;
        this.subAdminList.map((element, index) => {
          element['sr_no'] = index + 1;
        });
        this.loading = false;
        this.totalData = response?.counts;
        this.PageSize = response?.limit ? response?.limit : 10;
      }
    }, (_error) => {
      this.loading = false;
      this.notification.error(SUB_ADMIN_CONST.get_sub_admin_error);
    });
  }

  openModal(temp: TemplateRef<{}>, state: any, item: any) {
    this.mode = state;
    setTimeout(() => {
      this.firstname.nativeElement.focus();
    });
    this.createForm();
    if (state == 'add') {
      this.modalService.create({
        nzTitle: 'Add New Sub admin',
        nzContent: temp,
        nzFooter: [
          {
            label: 'Save',
            type: 'primary',

            onClick: () => this.createSubAdmin(),
          },
        ],
        nzWidth: '80%',
        nzMaskClosable: false,
        nzOnCancel: () => this.onClose(),
        nzAutofocus: null,
      });
    } else {
      this.editSubadmin(item);
      this.modalService.create({
        nzTitle: 'Update Sub Admin',
        nzContent: temp,
        nzFooter: [
          {
            label: 'Update',
            type: 'primary',

            onClick: () => this.updateSubadmin(item),
          },
        ],
        nzWidth: '80%',
        nzMaskClosable: false,
        nzOnCancel: () => this.onClose(),
        nzAutofocus: null,
      });
    }
  }

  showDeleteConfirm(row_id: any) {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this sub admin?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteSubadmin(row_id),
      nzCancelText: 'No',
      nzOnCancel: () => this.onClose(),
    });
  }

  showAccounts(row: any) {
    this.selectedSubAdminId = row['id'];
    this.isAccountsVisible = true;
  }

  createSubAdmin() {
    for (const i in this.subAdminForm.controls) {
      this.subAdminForm.controls[i].markAsDirty();
      this.subAdminForm.controls[i].updateValueAndValidity();
    }
    if (this.subAdminForm.valid && !this.matchPasswordErr) {
      const formObj = this.subAdminForm.value;
      this.subAdminService.createSubAdmin(formObj).then((response) => {
        this.subAdminList = [response['data'], ...this.subAdminList];
        this.subAdminList.map((element, index) => {
          element['sr_no'] = index + 1;
        });
        this.modalService.closeAll();
        this.notification.success(SUB_ADMIN_CONST.create_sub_admin_success);
      }, (_error) => {
        this.notification.error(SUB_ADMIN_CONST.create_sub_admin_error);
        this.modalService.closeAll();
      });
    }
  }

  matchPassword() {
    this.matchPasswordErr = false;
    if (
      this.subAdminForm.controls['password'].value !==
      this.subAdminForm.controls['confirmPassword'].value &&
      this.subAdminForm.controls['confirmPassword'].value !== ''
    ) {
      this.matchPasswordErr = true;
    }
  }

  onClose() {
    this.modalService.closeAll();
  }

  editSubadmin(item) {
    this.subAdminForm.patchValue({
      firstname: item.firstname,
      lastname: item.lastname,
      company: item.company,
      postcode: item.postcode,
      email: item.email,
      street: item.street,
      state: item.state
    });
    this.subAdminForm.get('password').clearValidators();
    this.subAdminForm.get('password').updateValueAndValidity();
  }

  updateSubadmin(item) {
    const formObj = this.subAdminForm.value;
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
    this.subAdminService.updateSubAdmin(item.id, data).then((response) => {
      this.subAdminList = this.subAdminList.map((element) => {
        if (element['id'] == item.id) {
          element = response['data'];
        }
        return element;
      });
      this.notification.success(SUB_ADMIN_CONST.update_sub_admin_success);
      this.modalService.closeAll();
    }, (_error) => {
      this.notification.error(SUB_ADMIN_CONST.update_sub_admin_error);
      this.modalService.closeAll();
    });
  }

  deleteSubadmin(subadmin_id) {
    this.subAdminService.deleteSubAdmin(subadmin_id).then((response) => {
      this.subAdminList = this.subAdminList.filter((element) => element['id'] !== subadmin_id);
      this.subAdminList.map((element, index) => {
        element['sr_no'] = index + 1;
      });
      this.notification.success(SUB_ADMIN_CONST.delete_sub_admin_success);
    }, (_error) => {
      this.notification.error(SUB_ADMIN_CONST.delete_sub_admin_error);
    });
  }

  statusChanged(event, row_data, key) {
    row_data[key] = event == true ? 1 : 0;
    this.subAdminService.updateSubAdmin(row_data.id, row_data).then((response: any) => {
      this.subAdminList.map((element) => {
        if (element['id'] == row_data.id) {
          element = response['data'];
        }
      });
      this.notification.success(SUB_ADMIN_CONST.status_update_success);
    }, (_error) => {
      this.notification.error(SUB_ADMIN_CONST.status_update_error);
    })
  }

  sortTable(event) {
    this.getSubAdminData(this.pag_params, event.sort_property, event.sort_order);
  }

  search(keyword) {
    this.search_keyword = keyword;
    this.getSubAdminData(this.pag_params, this.default_sort_property, this.default_sort_order, this.search_keyword);
  }

  indexChanged(event) {
    this.pag_params['pageIndex'] = event;
    this.getSubAdminData(this.pag_params);
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
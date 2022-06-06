import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { superAdminUserTableConfigJson, userTableConfigJSON } from '@configJson';
import { APP_CONST } from '@constants';
import { AccountService, NotificationService } from '@services';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DeviceListComponent } from 'src/app/shared/components/device-list/device-list.component';
import { DocumentListComponent } from 'src/app/shared/components/document-list/document-list.component';
import { ExportHistoryComponent } from 'src/app/shared/components/export-history/export-history.component';
import { PackagesComponent } from 'src/app/shared/components/packages/packages.component';
import { UserFormComponent } from 'src/app/shared/components/user-form/user-form.component';
import { ACCOUNT_CONST } from 'src/app/shared/constants/notifications.constant';
import { UserDetailsComponent } from 'src/app/shared/user-details/user-details.component';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  @ViewChild('actionTemplate') actionTemplate: TemplateRef<any>;
  @ViewChild('created_by_template') created_by_template: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate: TemplateRef<any>;
  accountList: Array<any>;
  accountTableJSON: any = [];
  superAdminRole: any = APP_CONST.Role.SuperAdmin;
  Data: any = [];
  row_data: any = {};
  currentUserDetails: any;
  scrollConfig: any = { x: 'auto', y: '100%' };
  pag_params: any = { pageIndex: 1, pageSize: 10 };
  totalData: number = 10;
  PageSize: number = 10;
  loading: boolean = true;
  search_keyword: any = '';
  default_sort_property: string = 'created_at';
  default_sort_order: any = 'desc';

  constructor(
    private modalService: NzModalService,
    private accountService: AccountService,
    private notification: NotificationService,
    private viewContainerRef: ViewContainerRef,
  ) { }

  ngOnInit(): void {
    let current_user_details: any = localStorage.getItem('current_user_details');
    this.currentUserDetails = JSON.parse(current_user_details);
    this.accountTableJSON = this.currentUserDetails.role == this.superAdminRole ? JSON.parse(JSON.stringify(superAdminUserTableConfigJson as any)) : JSON.parse(JSON.stringify(userTableConfigJSON as any));
    this.getDefaults();
    this.getAccountData();
  }

  async getAccountData(paginationParams = this.pag_params, sort_property = this.default_sort_property, sort_order = this.default_sort_order, search_query = this.search_keyword) {
    this.loading = true;
    const currentUserId = localStorage.getItem('current_user_id');
    let offset = (paginationParams.pageIndex - 1) * paginationParams.pageSize;
    let api_body = {
      created_by: currentUserId,
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
    this.accountService.getAllAccountsOfCurrentUser(api_body).then((account: any) => {
      if (account.success) {
        this.accountList = account?.data;
        this.accountList.map((element, index) => {
          element['sr_no'] = index + 1;
        });
        this.loading = false;
        this.totalData = account?.counts;
        this.PageSize = account?.limit ? account?.limit : 10;
      }
    },
      (_error) => {
        this.loading = false;
      }
    );
  }

  openModal(state: any, item: any) {
    this.modalService.create({
      nzTitle: state == 'add' ? 'Add New User' : 'Update User',
      nzContent: UserFormComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzWidth: '80%',
      nzComponentParams: {
        addData: state == 'add' ? this.currentUserDetails : [],
        item: item,
        state: state
      },
      // nzOnOk: (event) => {
      //   let formValue = event.accountForm.value;
      //   let valid: boolean = event.accountForm.valid;
      //   if (valid == true) {
      //     state == 'add' ? this.onSubmit(formValue) : this.updateUser(item.id, formValue);
      //     return true;
      //   } else {
      //     for (const i in event.accountForm.controls) {
      //       event.accountForm.controls[i].markAsDirty();
      //       event.accountForm.controls[i].updateValueAndValidity();
      //     }
      //     return false
      //   }
      // },
      nzMaskClosable: false,
      nzAutofocus: null,
      nzFooter: [
        {
          label: state == 'add' ? 'Save' : 'Update',
          type: 'primary',
          onClick: (event) => {
            let formValue = event.accountForm.value;
            let valid: boolean = event.accountForm.valid;
            if (valid == true) {
              state == 'add' ? this.onSubmit(formValue) : this.updateUser(item.id, formValue);
              return true;
            } else {
              for (const i in event.accountForm.controls) {
                event.accountForm.controls[i].markAsDirty();
                event.accountForm.controls[i].updateValueAndValidity();
              }
              return false
            }
          },
        },
      ],
    });
  }

  onClose() {
    this.modalService.closeAll();
    this.row_data = []
  }

  updateUser(id, event) {
    const input = new FormData();
    if (event['file'] !== null) input.append("file", event['file']);
    delete event['file'];
    input.append("data", JSON.stringify(event));
    this.accountService.updateAccount(id, input).then(
      (response: any) => {
        this.accountList = this.accountList.map((element) => {
          if (element['id'] == id) {
            element = response['data'];
          }
          return element;
        });
        this.notification.success(ACCOUNT_CONST.update_account_success);
        this.onClose();
      }, (error) => {
        if (error.status == 400) {
          this.notification.error(ACCOUNT_CONST.invalid_form);
        } else {
          this.notification.error(ACCOUNT_CONST.update_account_error);
        }
      })
  }

  showDeleteConfirm(row_id: any): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this account?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteAccount(row_id),
      nzCancelText: 'No',
      nzOnCancel: () => this.onClose(),
    });
  }

  deleteAccount(id) {
    this.accountService.deleteAccount(id).then(
      (response: any) => {
        if (response.success) {
          this.accountList = this.accountList.filter((element) => element['id'] !== id);
          this.accountList.map((element, index) => {
            element['sr_no'] = index + 1;
          });
          this.notification.success(ACCOUNT_CONST.delete_account_success);
        }
      }, (_error) => {
        this.notification.error(ACCOUNT_CONST.delete_account_error);
      });
  }

  onSubmit(event) {
    const input = new FormData()
    if (event['file'] !== null) input.append("file", event['file']);
    delete event['file'];
    input.append("data", JSON.stringify(event))
    this.accountService.createAccount(input).then(
      (result: any) => {
        if (result.success) {
          // this.accountList.push(result.data);
          this.accountList = [result['data'], ...this.accountList];
          this.accountList.map((element, index) => {
            element['sr_no'] = index + 1;
          });
          this.notification.success(ACCOUNT_CONST.create_account_success);
        }
        this.onClose();
      },
      (error) => {
        if (error.status == 400) {
          this.notification.error(ACCOUNT_CONST.invalid_form);
        } else {
          this.notification.error(ACCOUNT_CONST.create_account_error);
        }
      }
    );
  }

  getDefaults() {
    this.accountTableJSON.Header.showClose = false;
    setTimeout(() => {
      this.accountTableJSON.Columns = this.accountTableJSON.Columns.map(
        (column: any) => {
          if (column.property == 'actions') {
            column.actionTemplate = this.actionTemplate;
          } else if (column.property == 'created_by_id') {
            column.actionTemplate = this.created_by_template;
          } else if (column.property == 'emailverified') {
            column.actionTemplate = this.statusTemplate
          }
          return column;
        }
      );
    }, 0);
  }

  accountDetailsModel(row) {
    this.modalService.create({
      nzTitle: 'User Details',
      nzContent: UserDetailsComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        row_data: row
      },
      nzWidth: '50%',
      nzMaskClosable: false,
      nzAutofocus: null,
      nzFooter: [
        {
          label: 'Close',
          type: 'default',
          onClick: () => this.onClose(),
        },
      ],
      nzOnCancel: () => this.onClose(),
    });
  }

  statusChanged(event, row_data, key) {
    const body = {
      [key]: event
    }
    this.accountService.updateAccountStatus(row_data.id, body).then((response: any) => {
      this.accountList.map((element) => {
        if (element['id'] == row_data.id) {
          element = response['data'];
        }
      });
      this.notification.success(ACCOUNT_CONST.status_update_success);
    }, (_error) => {
      this.notification.error(ACCOUNT_CONST.status_update_error);
    })
  }

  openDocumentModal(row_data) {
    this.modalService.create({
      nzTitle: 'Documents',
      nzContent: DocumentListComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        account_id: row_data.id,
      },
      nzWidth: '60%',
      // nzOnOk: (event) => { this.uploadDocument(row_data.id, event.documentForm.value); },
      nzMaskClosable: false,
      nzAutofocus: null,
      nzOnCancel: () => this.onClose(),
    });
  }

  openDevicesModel(row_data) {
    this.modalService.create({
      nzTitle: 'Devices',
      nzContent: DeviceListComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzComponentParams: {
        account_id: row_data.id,
      },
      nzWidth: '70%',
      nzMaskClosable: false,
      nzAutofocus: null,
      nzOnCancel: () => this.onClose(),
    });
  }

  sortAccountTable(event) {
    this.getAccountData(this.pag_params, event.sort_property, event.sort_order);
  }

  search(keyword) {
    this.search_keyword = keyword;
    this.getAccountData(this.pag_params, 'reseller_firstname', 'ascend', this.search_keyword);
  }

  indexChanged(event) {
    this.pag_params['pageIndex'] = event;
    this.getAccountData(this.pag_params);
  }

  openHistoryModel(row_data) {
    this.modalService.create({
      nzTitle: 'History',
      nzContent: ExportHistoryComponent,
      nzViewContainerRef: this.viewContainerRef,
      /* nzComponentParams: {
        account_id: row_data.id,
      }, */
      nzWidth: '70%',
      nzMaskClosable: false,
      nzAutofocus: null,
      nzOnCancel: () => this.onClose(),
    });
  }

  openPackageModel(row_data) {
    this.modalService.create({
      nzTitle: 'Packages',
      nzContent: PackagesComponent,
      nzViewContainerRef: this.viewContainerRef,
      /* nzComponentParams: {
        account_id: row_data.id,
      }, */
      nzWidth: '70%',
      nzMaskClosable: false,
      nzAutofocus: null,
      nzOnCancel: () => this.onClose(),
    });
  }
}
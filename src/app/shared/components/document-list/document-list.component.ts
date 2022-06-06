import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, Observer } from 'rxjs';
import { APP_CONST } from '../../constants/app.constant';
import { ACCOUNT_CONST, DOCUMENT_CONST } from '../../constants/notifications.constant';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})

export class DocumentListComponent implements OnInit {

  @Input() account_id;
  docList: any = [];
  documentForm: FormGroup;
  old_id: any;
  isConfirmLoading: boolean = false;

  constructor(private documentService: DocumentService, private notification: NzNotificationService, private modalService: NzModalService,) { }

  ngOnInit(): void {
    this.getAllDocs(this.account_id);
    this.documentForm = new FormGroup({
      file: new FormControl(null),
    })
  }

  getAllDocs(account_id) {
    let data = {
      offset: 0,
      limit: 30,
      account_id: account_id
    }
    this.documentService.getAllDocuments(data).subscribe((result: any) => {
      if (result.success == true) {
        this.docList = result.data;
      }
    })
  }

  openFileBrowser(id) {
    if (document.getElementById(id)) {
      document.getElementById(id).click();
    }
  }

  handleChange(event) {
    let rules = {
      accept: ['application/pdf'],
      size: APP_CONST.MaxFileSizeInMB
    }
    const files = event.target.files;
    this.validateSizeBeforeUpload(files[0], rules).subscribe(isValid => {
      if (isValid) {
        this.documentForm.patchValue({
          file: files[0]
        })
      }
    })
  }

  validateSizeBeforeUpload = (file, rules) => {
    return new Observable((observer: Observer<boolean>) => {
      if (file) {
        let isAcceptable = false, isValidSize = false;
        if (rules.accept) {
          isAcceptable = rules.accept.indexOf(file.type) != -1 ? true : false
        }
        if (rules.size) {
          isValidSize = file.size / 1024 / 1024 < rules.size ? true : false
        }
        if (!isAcceptable) {
          this.notification.create('error', 'File Type Error', `File ${file.name} is not valid for upload.`, { nzDuration: 6000, nzPauseOnHover: true });
        }
        if (!isValidSize) {
          this.notification.create('error', 'File Size Error', `File ${file.name} is larger then ${APP_CONST.MaxFileSizeInMB}MB.`, { nzDuration: 6000, nzPauseOnHover: true });
        }
        observer.next(isAcceptable && isValidSize);
        observer.complete();
      }
    });
  };

  editDocument(doc_data) {
    this.old_id = doc_data.id;
    let file_name = { name: doc_data.document_name, id: doc_data.id }
    this.documentForm.patchValue({ file: file_name })
  }

  showDeleteConfirm(id: any): void {
    this.modalService.confirm({
      nzTitle: 'Are you sure you want to delete this document?',
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteDocument(id),
      nzCancelText: 'No',
      // nzOnCancel: () => this.onClose(),
    });
  }

  downloadFile(id: any): void {
    this.documentService.downloadDocument(id).subscribe((result: any) => {
      let dataType = result.type;
      let binaryData = [];
      binaryData.push(result);
      let downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
      if (id + '.pdf')
        downloadLink.setAttribute('download', id + '.pdf');
      document.body.appendChild(downloadLink);
      downloadLink.click();

    }, (_error) => {
      this.notification.create('error', 'File Missing', `Server Error, Please try again`, { nzDuration: 6000, nzPauseOnHover: true });
    })
  }

  deleteDocument(id) {
    this.documentService.deleteDocument(id).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.docList = this.docList.filter((element) => element['id'] !== id);
        this.notification.create('success', DOCUMENT_CONST.delete_doc_success, '', { nzDuration: 6000, nzPauseOnHover: true });
      }
    }, (_error) => {
      this.notification.create('error', DOCUMENT_CONST.delete_doc_error, '', { nzDuration: 6000, nzPauseOnHover: true });
    })
  }

  onClose() {
    this.isConfirmLoading = false;
    this.modalService.closeAll();
  }

  cancelChanges() {
    this.documentForm.patchValue({ file: null });
    this.old_id = null;
  }

  saveChanges() {
    let event = this.documentForm.value;
    this.isConfirmLoading = true;
    if (event['file'] !== null && event['file']?.size) {
      const input = new FormData();
      if (event['file'] !== null) input.append("file", event['file']);
      delete event['file'];
      if (this.old_id) {
        input.append("doc_id", this.old_id);
        this.updateDocument(input);  /* Update old document */
      } else {
        input.append("account_id", String(this.account_id));
        this.uploadDocument(input);  /* Upload new document */
      }
    } else {
      this.onClose();
    }
  }

  uploadDocument(input) {
    this.documentService.uploadNewDocument(input).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.notification.create('success', result.message, '', { nzDuration: 6000, nzPauseOnHover: true });
        this.onClose();
      }
    }, (_error) => {
      this.notification.create('success', ACCOUNT_CONST.upload_doc_error, '', { nzDuration: 6000, nzPauseOnHover: true });
      this.onClose();
    })
  }

  updateDocument(input) {
    this.documentService.updateOldDocument(input).subscribe((result: any) => {
      if (result.statusCode == 200) {
        this.notification.create('success', result.message, '', { nzDuration: 6000, nzPauseOnHover: true });
        this.onClose();
      }
    }, (_error) => {
      this.notification.create('error', DOCUMENT_CONST.update_doc_error, '', { nzDuration: 6000, nzPauseOnHover: true });
      this.onClose();
    })
  }
}

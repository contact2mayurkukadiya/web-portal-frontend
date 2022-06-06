import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService, NotificationService } from '@services';
import { PROFILE_CONST } from 'src/app/shared/constants/notifications.constant';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  matchPasswordErr: boolean = false;
  saveChanges: boolean = false;
  currentUserId = localStorage.getItem('current_user_id');
  current_user_details: any = JSON.parse(localStorage.getItem('current_user_details'));
  // subAdminRole: any = APP_CONST.Role.SubAdmin;

  constructor(private formBuilder: FormBuilder, private adminService: AdminService, private notification: NotificationService) { }

  ngOnInit(): void {
    this.createForm(this.current_user_details);
  }

  createForm(userData) {
    this.profileForm = this.formBuilder.group(
      {
        firstname: [userData.firstname],
        lastname: [userData.lastname],
        company: [userData.company],
        street: [userData.street],
        state: [userData.state],
        postcode: [userData.postcode],
        old_password: [null],
        password: [null],
        confirmPassword: [null],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      })
  }

  onSubmit() {
    // 
  }

  matchPassword() {
    this.matchPasswordErr = false;
    this.saveChanges = true;
    if (
      this.profileForm.controls['password'].value !==
      this.profileForm.controls['confirmPassword'].value &&
      this.profileForm.controls['confirmPassword'].value !== ''
    ) {
      this.matchPasswordErr = true;
      this.saveChanges = false;
    }
  }

  addPwdValidator() {
    if (this.profileForm.controls['old_password'].value.length) {
      this.profileForm.controls["password"].setValidators([Validators.required]);
      this.profileForm.controls["confirmPassword"].setValidators([Validators.required]);
    } else {
      this.profileForm.get('password').clearValidators();
      this.profileForm.get('confirmPassword').clearValidators();
    }
    this.profileForm.get('confirmPassword').updateValueAndValidity();
    this.profileForm.get('password').updateValueAndValidity();
  }

  updateAccountDetails() {
    let formObj = this.profileForm.value;
    let id = this.currentUserId;
    let data: any = {
      firstname: formObj.firstname,
      lastname: formObj.lastname,
      company: formObj.company,
      street: formObj.street,
      state: formObj.state,
      postcode: formObj.postcode
    }
    if (formObj.password !== null) {
      data['old_password'] = formObj.old_password;
      data['password'] = formObj.password;
    }
    this.adminService.updateAdmin(id, data).then((result: any) => {
      if (result?.success == true) {
        delete result.data.password;
        localStorage.setItem('current_user_details', JSON.stringify(result.data));
        this.notification.success(PROFILE_CONST.update_password_success);
        this.saveChanges = false;
        this.profileForm.reset();
      }
    }, (error) => {
      if (error.error.statusCode == 403) {
        this.notification.error(error.error.message);
      } else {
        this.notification.error(PROFILE_CONST.update_password_error);
      }
      this.saveChanges = false;
    })
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
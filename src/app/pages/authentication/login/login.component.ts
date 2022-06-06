import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService, NotificationService } from '@services';
import { APP_CONST } from 'src/app/shared/constants/app.constant';
import { LOGIN_CONST } from 'src/app/shared/constants/notifications.constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  btn_loader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginservice: LoginService,
    private notification: NotificationService
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.fnLogin(this.validateForm.value);
      // this.router.navigate(['/dashboard']);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  fnLogin(data: any) {
    this.btn_loader = true;
    this.loginservice.LogIn(data).then((response: any) => {
      if (response?.success) {
        let login_response: any = response.data;
        let current_user_details: any = {
          id: login_response.id,
          username: login_response.username,
          email: login_response.email,
          role: login_response.role,
          status: login_response.status,
        };
        localStorage.setItem('current_user_details', JSON.stringify(login_response));
        localStorage.setItem('current_user_id', current_user_details.id);
        localStorage.setItem('access_token', login_response.access_token);
        this.btn_loader = false;
        // this.notification.success(response.message);


        if (login_response.role == APP_CONST.Role.SuperAdmin) {
          this.router.navigate(['/admin']);
        } else if (login_response.role == APP_CONST.Role.Admin) {
          this.router.navigate(['/sub-admin']);
        } else if (login_response.role == APP_CONST.Role.SubAdmin) {
          this.router.navigate(['/user']);
        }

      }
    }, (_error) => {
      this.btn_loader = false;
      this.notification.error(LOGIN_CONST.login_failed);
    });
  }
}

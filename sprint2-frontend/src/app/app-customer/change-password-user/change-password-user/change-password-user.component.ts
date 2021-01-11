// @ts-ignore
import {Component, OnInit} from '@angular/core';
// @ts-ignore
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// @ts-ignore
import {Router} from '@angular/router';
// @ts-ignore
import {MatDialog} from '@angular/material/dialog';
import {ConfirmEmailComponent} from '../confirm-email/confirm-email.component';
import {ChangePasswordService} from "../../../service/nqkhanh/change-password.service";

// @ts-ignore
@Component({
  selector: 'app-change-password-user',
  templateUrl: './change-password-user.component.html',
  styleUrls: ['./change-password-user.component.css']
})
export class ChangePasswordUserComponent implements OnInit {
  public confirmPassWordForm: FormGroup;
  public idAccount;
  public account;
  public message: string;

  constructor(public formBuilder: FormBuilder, public changePasswordService: ChangePasswordService, public route: Router,
              public dialog: MatDialog) {
    this.confirmPassWordForm = this.formBuilder.group({
      passwordOld: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,20}$')]],
      passwordNew: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,20}$')]],
      confirmPassword: ['', [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,20}$')]]
    }, {validator: this.checkPasswordConfirm});
  }

  checkPasswordConfirm(group: FormGroup) {
    const passwordNew = group.controls.passwordNew.value;
    const confirmPass = group.controls.confirmPassword.value;
    return passwordNew === confirmPass ? null : {notSame: true};
  }

  ngOnInit(): void {
  }

  confirmPassWordFunction() {
    if (this.confirmPassWordForm.valid) {
      this.changePasswordService.findAppAccountById(1).subscribe(dataAccount => {
        this.account = {
          passwordOld: this.confirmPassWordForm.controls.passwordOld.value,
          passwordNew: this.confirmPassWordForm.controls.passwordNew.value
        };
        this.changePasswordService.confirmPassword(dataAccount.id, this.account).subscribe(dataConfirmPassword => {
          console.log(dataConfirmPassword);
          if (dataConfirmPassword.message === 'Wright password') {
            this.changePasswordService.setVerifyAndSendMail(1).subscribe();
            const dialogA = this.dialog.open(ConfirmEmailComponent, {
              width: '800px',
              position: {
                top: '100px'
              },
              data: {dataAccount: this.account.passwordNew},
              disableClose: true
            });
          } else {
            this.message = 'Mật khẩu không chính xác, vui lòng nhập lại';
          }
        });
      });
    }
  }
}

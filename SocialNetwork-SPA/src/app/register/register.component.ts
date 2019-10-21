import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service.ts';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from 'src/_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Input() valuesFromHome: any;
  @Output() cancelRegister = new EventEmitter<boolean>();
  bsConfig: Partial<BsDatepickerConfig>;
  registerForm: FormGroup;
  model: any = {};
  constructor(private authService: AuthService, private alertifyService: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      gender: new FormControl('male'),
      username : new FormControl('', Validators.required),
      knownAs: new FormControl('', Validators.required),
      dateOfBirth: new FormControl(null, Validators.required),
      city: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
    password : new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword : new FormControl('', Validators.required),

    }, this.passwordMatchValidator);
    this.bsConfig = {
      containerClass : 'theme-red'
    };
  }

passwordMatchValidator(g: FormGroup) {
  return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch' : true};
}
  register() {
      // this.authService.register(this.model).subscribe( () => {
      // this.alertifyService.success( 'Register successfully');
      // }, error => {
      // this.alertifyService.error(error);
      // })

      if(this.registerForm.valid) {
        const user: User = Object.assign({}, this.registerForm.value);
        this.authService.register(user).subscribe(() => {
          this.alertifyService.success('Register successfully!');
        }, error => {
          this.alertifyService.error(error);
        }, () => {
          this.authService.login(user).subscribe(() => {
            this.router.navigate(['/members']);
          });
        });
      }

      console.log(this.registerForm.value);
      console.log(this.registerForm);
  }

  cancel(){
    this.cancelRegister.emit(false);
    console.log("Cancelled!");
  }

}

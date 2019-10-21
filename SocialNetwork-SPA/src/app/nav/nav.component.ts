import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service.ts';
import { Router } from '@angular/router';
import { User } from 'src/_models/user';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {


  model: any  = {};
  photoUrl: string;
  constructor(public authService: AuthService, private alertifyService: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.authService.setDecodedToken(localStorage.getItem('token'));
    
    this.authService.currentPhoto.subscribe(photo => {
      this.photoUrl = photo;
    })

    const user: User = JSON.parse(localStorage.getItem('user'));

    if (user) {
      this.authService.currentUser = user;
      this.authService.ChangeMainPhoto(user.photoUrl);
    }
    
    


  }

  login() {
    console.log(this.model);

    this.authService.login(this.model).subscribe(next => {
      this.alertifyService.success('Login successfully');
    }, error => {
     this.alertifyService.error(error);
    }, () => {
        this.router.navigate(['/members']);
    });
  }


  loggedIn() {
     return this.authService.loggedIn();
  }

  logout() {
    localStorage.removeItem('token');
    this.alertifyService.message('Logout');
    this.router.navigate(['/']);
    localStorage.removeItem('user');
    this.authService.currentUser = null;
    this.authService.decodedToken = null;
  }

}

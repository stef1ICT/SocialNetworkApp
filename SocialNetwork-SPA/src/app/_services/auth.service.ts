import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from 'src/_models/user';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {


decodedToken: any;

  baseURL = environment.apiUrl + 'auth/';
  photoUrl = new BehaviorSubject<string>('https://image.shutterstock.com/image-vector/profile-photo-vector-placeholder-pic-260nw-535853263.jpg');

  currentPhoto = this.photoUrl.asObservable();
constructor(private http: HttpClient) { }
helper = new JwtHelperService();
currentUser: User;

ChangeMainPhoto(photoUrl: string) {
  this.photoUrl.next(photoUrl);
}
login(model: User) {

return  this.http.post(this.baseURL + 'login', model).pipe(map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.currentUser = user.user;
            this.decodedToken = this.helper.decodeToken(user.token);
            this.ChangeMainPhoto(this.currentUser.photoUrl);
            console.log(this.decodedToken);
          }
  }));
}

register(model: User) {
  return this.http.post(this.baseURL + 'register', model);
}

loggedIn() {
const token = localStorage.getItem('token');

return !this.helper.isTokenExpired(token);
}

setDecodedToken(token: any) {
    this.decodedToken = this.helper.decodeToken(token);
}

}

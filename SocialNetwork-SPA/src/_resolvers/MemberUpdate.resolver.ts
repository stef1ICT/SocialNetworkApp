import {Injectable} from '@angular/core';
import {Resolve, Router, ActivatedRoute, RouterStateSnapshot} from '@angular/router';
import {User} from '../_models/user';
import {UserService} from '../app/_services/User.service';
import { Observable, of } from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AlertifyService} from '../app/_services/alertify.service.ts';
import { AuthService } from 'src/app/_services/auth.service';
@Injectable()
export class MemberUpdateResolver implements Resolve<User> {
  resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: RouterStateSnapshot): User | Observable<User> | Promise<User> {
    
    return this.userService.getUser(this.authService.decodedToken.nameid);
  }

  constructor(private router: Router, private userService: UserService, private alertify: AlertifyService, private authService: AuthService) {}

  
}

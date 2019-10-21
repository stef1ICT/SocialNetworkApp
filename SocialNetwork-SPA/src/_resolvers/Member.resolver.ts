import { User } from 'src/_models/user';
import { PaginationResult } from 'src/_models/Pagination';
import { Resolve } from '@angular/router';
import { UserService } from 'src/app/_services/User.service';

export class MemberResolver implements Resolve<PaginationResult<User[]>>{
  resolve(route: import("@angular/router").ActivatedRouteSnapshot, state: import("@angular/router").RouterStateSnapshot): PaginationResult<User[]> | import("rxjs").Observable<PaginationResult<User[]>> | Promise<PaginationResult<User[]>> {
    return this.userService.getUsers();
  }
  constructor(private userService: UserService) {

  }
  }

  


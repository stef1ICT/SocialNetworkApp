import { Resolve, ActivatedRoute, RouterStateSnapshot } from '@angular/router';
import { User } from 'src/_models/user';
import { UserService } from 'src/app/_services/User.service';
import { Pagination, PaginationResult } from 'src/_models/Pagination';
import { Observable } from 'rxjs';

export class ListResolver implements Resolve<User[]> {

  page = 1;
  perPage = 5;
  likers = 'likees';
  users: User[];
  constructor(private userService: UserService) {

  }
  resolve() : User[] | Observable<any> | Promise<User[]> {
    return  this.userService.getUsers(this.page, this.perPage, null, this.likers);
}
}
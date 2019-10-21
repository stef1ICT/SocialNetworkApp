import { Component, OnInit } from '@angular/core';
import { User } from 'src/_models/user';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service.ts';
import { PaginationResult, Pagination } from 'src/_models/Pagination';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  currentUser: User;
  genders = [{value: 'male', name: 'Males'}, {value: 'female', name: 'Females'}];
  userParams: any = {};
  pagination: Pagination;
  constructor(private route: ActivatedRoute, private userService: UserService, private alertifyService: AlertifyService) { }

  ngOnInit() {
      this.route.data.subscribe((data) => {
          const result: PaginationResult<User[]> = data.users;
          this.users = result.result;
          this.pagination = result.pagination;
      });
      console.log(this.pagination);
      this.currentUser = JSON.parse(localStorage.getItem('user'));
      this.userParams.maxAge = 99;
      this.userParams.minAge = 18;
      this.userParams.orderBy = 'lastActive';
      this.userParams.gender = (this.currentUser.gender === 'male') ? 'male' : 'female';
  }

  pageChanged(currentPage) {
    this.pagination.currentPage = currentPage.page;
    this.loadUsers(this.pagination.currentPage, this.pagination.itemsPerPage);
  }

  resetForm() {
    this.userParams.maxAge = 99;
    this.userParams.minAge = 18;
    this.userParams.orderBy = 'lastActive';
    this.userParams.gender = (this.currentUser.gender === 'male') ? 'male' : 'female';
    this.loadUsers();
  }

  loadUsers(currentPage?, itemsPerPage?, userParams? ) {
    this.userService.getUsers(currentPage, itemsPerPage, this.userParams)
    .subscribe( (users: PaginationResult<User[]>) => { 
      this.pagination = users.pagination;
      this.users = users.result; },
    error => {
      this.alertifyService.error(error);
    });
  }

  filter() {
    this.loadUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams);
  }

  orderBy() {
    this.loadUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams);
  }
}

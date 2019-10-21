import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/_models/user';
import { Pagination, PaginationResult } from 'src/_models/Pagination';
import { UserService } from '../_services/User.service';
import { AlertifyService } from '../_services/alertify.service.ts';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userService:UserService, private alertifyService: AlertifyService) { }
  users: User[];
  pagination: Pagination;
  likesParam: string;
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    })
    this.likesParam = 'Likers';
  }



  loadUsers() {
   this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam)
    .subscribe( (users: PaginationResult<User[]>) => { 
      this.pagination = users.pagination;
      this.users = users.result; },
    error => {
      this.alertifyService.error(error);
    });
  }


  pageChanged(currentPage) {
    this.pagination.currentPage = currentPage.page;
    this.loadUsers();
  }

}

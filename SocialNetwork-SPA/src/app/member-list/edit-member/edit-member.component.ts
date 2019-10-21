import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/User.service';
import { User } from 'src/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service.ts';

@Component({
  selector: 'app-edit-member',
  templateUrl: './edit-member.component.html',
  styleUrls: ['./edit-member.component.css']
})
export class EditMemberComponent implements OnInit {

  @ViewChild('editForm', {static: false}) editForm;
  user: User;
  constructor(private route: ActivatedRoute, private authService: AuthService, private userService: UserService, private alertify:AlertifyService) { }
  photoUrl: string;
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    
    this.authService.currentPhoto.subscribe(photo => {
      this.photoUrl = photo;
    })
    //  this.userService.getUser(this.authService.decodedToken.nameid).subscribe( (user: User) => {
    //    this.user = user;
    //  });
  }


  updateUser() {
    this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
      this.alertify.success('Profile update successfully!');
      this.editForm.reset(this.user);
    }, error => {
      this.alertify.error(error);
    })
    
  }



}

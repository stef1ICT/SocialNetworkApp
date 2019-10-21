import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/User.service';
import { AlertifyService } from 'src/app/_services/alertify.service.ts';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  @Input() user: User;
  photoUrl: string;
  constructor(private authService: AuthService, private userService:UserService, private alertifyService: AlertifyService) { }

  ngOnInit() {
    this.authService.currentPhoto.subscribe(photo => {
      this.photoUrl = photo;
    })
  }


  likeUser(id: number) {
      this.userService.likeUser(this.authService.decodedToken.nameid, id).subscribe(() => {
        this.alertifyService.success('You like user : ' + this.user.knownAs);
      }, error => {
        this.alertifyService.error('You\'re already like user ' + this.user.knownAs);
      })
  }
}

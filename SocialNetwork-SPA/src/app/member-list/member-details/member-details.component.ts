import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/User.service';
import { User } from 'src/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service.ts';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
import { NgxGalleryImage, NgxGalleryOptions, NgxGalleryAnimation } from 'ngx-gallery';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  photoUrl:string;
  user: User;
  constructor(private userService: UserService, private route: ActivatedRoute, private alertifyService: AlertifyService, private authService:AuthService ) { }

  ngOnInit() {
  // this.loadUser();
  this.route.data.subscribe(data => {
    this.user = data['user']; });
    this.galleryOptions = [{
      width: '500px',
      height:'500px',
      imagePercent: 100,
      thumbnailsColumns : 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview: false
  }];
  this.authService.currentPhoto.subscribe(photo => {
    this.photoUrl = photo;
  })
  this.galleryImages = this.getImages();
  }
  getImages() {
    const imageUrls = [];

    for(let i=0; i < this.user.photos.length; i++) {
      imageUrls.push({
          small: this.user.photos[i].url,
          medium: this.user.photos[i].url,
          big: this.user.photos[i].url,
          description: this.user.photos[i].description
      });
    }
    return imageUrls;
  }




  }
 




  // private loadUser() {
  //   // tslint:disable-next-line: no-string-literal
  //   this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user: User) => {
  //     this.user = user;
  //   }, error => {
  //     this.alertifyService.error(error);
  //   });
  // }


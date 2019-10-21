import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { User } from 'src/_models/user';
import { UserService } from 'src/app/_services/User.service';
import { AlertifyService } from 'src/app/_services/alertify.service.ts';

@Component({
  selector: 'app-photo-edit',
  templateUrl: './photo-edit.component.html',
  styleUrls: ['./photo-edit.component.css']
})
export class PhotoEditComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() changeMainPhoto = new EventEmitter<string>();
   uploader: FileUploader;
   hasBaseDropZoneOver = false;
   hasAnotherDropZoneOver = false;
   baseUrl = environment.apiUrl;
   currentMainPhoto: Photo;
 
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  constructor(private authService: AuthService, private userService: UserService, private alertifyService: AlertifyService) { }

  ngOnInit() {
  this.initializeFileUploader();
  }

  initializeFileUploader() {
      this.uploader = new FileUploader({
          url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
          authToken: 'Bearer ' + localStorage.getItem('token'),
          isHTML5 : true,
          allowedFileType: ['image'],
          maxFileSize : 10 * 1024 * 1024,
          removeAfterUpload : true,
          autoUpload: false
      });

      this.uploader.onAfterAddingFile = (file) => {
        file.withCredentials = false;
      };

      this.uploader.onSuccessItem = (item, response, status, header) => {
        if(response) {
          const res: Photo = JSON.parse(response);

          const photo = {
            id: res.id,
            url: res.url,
            description: res.description,
            dateAdded: res.dateAdded,
            isMain: res.isMain
          };
          if(photo.isMain) {
            this.authService.ChangeMainPhoto(photo.url);
            this.authService.currentUser.photoUrl = photo.url;
            localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
          }
          this.photos.push(photo);
        }
      }
  }

  setMainPhoto(photo: Photo) {
   this.userService.setTheMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
    this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
    this.currentMainPhoto.isMain = false;
    photo.isMain = true;
    
    this.authService.ChangeMainPhoto(photo.url);
   
   }, error => {
     this.alertifyService.error(error);
   });
  }


  deletePhoto(photoId: number) {

      this.alertifyService.confirm('Are you sure you want to delete this photo?', () => {
        this.userService.deletePhoto(this.authService.decodedToken.nameid, photoId).subscribe(() => {
          this.photos.splice(this.photos.findIndex(p => p.id === photoId),1);
          this.alertifyService.success('Photo has been deleted');
          
        },error => {
          this.alertifyService.error(error);
        })
      });

 
  }
} 

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { PhotoForUserDetail } from 'src/app/models/photo-for-user-detail.model';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';
import { AlertifyService } from 'src/app/services/alertify.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: PhotoForUserDetail[];
  @Output() getMainPhotoChange = new EventEmitter<string>();

  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.initalizeFileUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initalizeFileUploader() {
    this.uploader = new FileUploader({
      url: `${environment.apiUrl}users/${
        this.authService.decondedToken.nameid
      }/photos`,
      authToken: `bearer ${localStorage.getItem('token')}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response) => {
      this.photos.push();

      const parsedPhoto: PhotoForUserDetail = JSON.parse(response);

      const photo: PhotoForUserDetail = {
        id: parsedPhoto.id,
        dateAdded: parsedPhoto.dateAdded,
        description: parsedPhoto.description,
        isMain: parsedPhoto.isMain,
        url: parsedPhoto.url
      };

      this.photos.push(photo);
    };
  }

  setMain(photo: PhotoForUserDetail) {
    this.userService.setMainPhoto(photo.id).subscribe(
      () => {
        const currentMain = this.photos.filter(p => p.isMain)[0];
        currentMain.isMain = false;
        photo.isMain = true;
        this.getMainPhotoChange.emit(photo.url);
      },
      error => this.alertifyService.error(error)
    );
  }
}

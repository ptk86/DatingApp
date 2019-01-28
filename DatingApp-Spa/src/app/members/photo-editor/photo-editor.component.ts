import { Component, OnInit, Input } from '@angular/core';
import { PhotoForUserDetail } from 'src/app/models/photo-for-user-detail.model';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: PhotoForUserDetail[];

  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  constructor(private authService: AuthService) {}

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
  }
}

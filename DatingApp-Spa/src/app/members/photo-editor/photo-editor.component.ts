import { Component, OnInit, Input } from '@angular/core';
import { PhotoForUserDetail } from 'src/app/models/photo-for-user-detail.model';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: PhotoForUserDetail[];

  constructor() { }

  ngOnInit() {
  }

}

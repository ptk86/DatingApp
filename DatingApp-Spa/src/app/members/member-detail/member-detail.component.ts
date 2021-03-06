import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDetail } from 'src/app/models/user-detail.model';
import {
  NgxGalleryOptions,
  NgxGalleryAnimation,
  NgxGalleryImage
} from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  user: UserDetail;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  @ViewChild('memberTabs') memeberTabs: TabsetComponent;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.user = data['user'];
    });

    this.activatedRoute.queryParams.subscribe(queryParams => {
      const tabId = queryParams['tabId'];
      this.selectTab(tabId);
    });

    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];

    this.galleryImages = this.getImages();
  }

  private getImages(): NgxGalleryImage[] {
    const imageUrls: NgxGalleryImage[] = [];

    for (let i = 0; i < this.user.photos.length; i++) {
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description
      });
    }
    return imageUrls;
  }

  selectTab(tabId: number) {
    this.memeberTabs.tabs[tabId].active = true;
  }
}

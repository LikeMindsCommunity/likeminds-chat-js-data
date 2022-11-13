import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ProfileService } from 'src/app/core/services/profile.service';
import { StartLoading } from 'src/app/shared/store/actions/app.action';
import { State } from 'src/app/shared/store/reducers';

@Component({
  selector: 'app-mobile-image-cropper',
  templateUrl: './mobile-image-cropper.component.html',
  styleUrls: ['./mobile-image-cropper.component.scss']
})
export class MobileImageCropperComponent implements OnInit {
  @Input() event: any;
  @Input() member_id: number;
  @Input() community_id: number;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() update: EventEmitter<any> = new EventEmitter();

  @ViewChild(MobileImageCropperComponent)
  imageCroper: MobileImageCropperComponent;
  croppedImage: any = '';

  constructor(
    private store: Store<State>,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = this.b64toBlob(event.base64);
  }

  b64toBlob(dataURI: string) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  }

  cancel() {
    this.close.emit(true);
  }

  upload() {
    this.store.dispatch(StartLoading());
    this.profileService.uploadMemberImage({community_id: this.community_id, member_id: this.member_id}, this.croppedImage).subscribe(response => {
      if (response) {
        this.update.emit(response);
        this.close.emit(true);
      }
    })
  }

}

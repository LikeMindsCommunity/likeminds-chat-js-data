import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { ProfileService } from 'src/app/core/services/profile.service';
import { StartLoading } from '../../store/actions/app.action';
import { State } from '../../store/reducers';

@Component({
    selector: 'app-image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-cropper.component.scss'],
})
export class ImageCropperComponent implements OnInit {
    @ViewChild(ImageCropperComponent)
    imageCroper: ImageCropperComponent;
    croppedImage: any = '';

    constructor(
        private dialogRef: MatDialogRef<any>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            member_id: number;
            event: any;
        },
        private profileService: ProfileService,
        private store: Store<State>
    ) {}

    ngOnInit(): void {}

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

    close() {
        this.dialogRef.close();
    }

    upload() {
        this.store.dispatch(StartLoading());
        this.profileService.uploadAccountProfileImage({ member_id: this.data.member_id }, this.croppedImage).subscribe((response) => {
            if (response) this.dialogRef.close(response);
        });
    }
}

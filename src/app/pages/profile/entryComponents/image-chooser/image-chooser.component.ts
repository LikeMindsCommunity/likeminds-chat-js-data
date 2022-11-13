import { Component, OnInit, Inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

const MAX_FILE_SIZE_IN_MBS = 16;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_IN_MBS * 1024 * 1024;

@Component({
  selector: 'app-image-chooser',
  templateUrl: './image-chooser.component.html',
  styleUrls: ['./image-chooser.component.scss']
})
export class ImageChooserComponent implements OnInit {

  constructor(
    private sheetRef: MatBottomSheetRef<any>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {
      community_id: number,
      member_id: number
    },
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  uploadImage(event, image_source: string): void {
    if (this.checkIfErrorInFiles(event.target.files)) { return; }
    this.sheetRef.dismiss({event, image_source});
  }

  checkIfErrorInFiles(files): boolean {
    const fileArray: any[] = Array.from(files);
    if (fileArray.find(file => file.size > MAX_FILE_SIZE_BYTES)) {
        this.snackbar.open(`Maximum allowed size is ${MAX_FILE_SIZE_IN_MBS}Mbs.`, undefined, {
          panelClass: ['snackbar'],
          duration: 3000
        });
        return true;
    }
    return false;
  }

  close() {
    this.sheetRef.dismiss();
  }

}

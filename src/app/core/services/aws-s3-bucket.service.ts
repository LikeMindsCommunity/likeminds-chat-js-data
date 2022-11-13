import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';
import { environment } from 'src/environments/environment';
import { from, Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root',
})
export class AwsS3BucketService {
    mediaObjects: any[] = [];
    totalBytesUploaded$$ = new BehaviorSubject<number>(0);
    totalBytesUploadedObject$$ = new BehaviorSubject<any>({});

    constructor(private utilsService: UtilsService) {}
    getAWS(): any {
        (AWS.config.region = 'ap-south-1'),
            (AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: environment.poolId,
            }));
        const s3 = new AWS.S3({
            apiVersion: '2006-03-01',
            params: { Bucket: 'beta-likeminds-media' },
        });

        return s3;
    }

    uploadRemainingMedias(messageId, chatroomId, files) {
        return Promise.all(
            Array.from(files).map(async (file, index) => {
                return await this.uploadMedia(messageId, chatroomId, file, index);
            })
        );
    }

    uploadMedia(messageId, chatroomId, file, index?) {
        let mediaObject = this.getAWS().upload({
            Key: `files/collabcard/${chatroomId}/conversation/${messageId}/${file.name}`,
            Bucket: environment.awsBucket,
            Body: file,
            ACL: 'public-read-write',
            ContentType: file.type,
        });

        this.mediaObjects.push(mediaObject);

        mediaObject.send();

        mediaObject.on('httpUploadProgress', (progress) => {
            let id = chatroomId.toString() + messageId.toString();
            let tempProgressVal = this.totalBytesUploadedObject$$.value;
            let currentProgressArray = tempProgressVal[id] ? tempProgressVal[id] : [];
            currentProgressArray[index] = progress.loaded;
            tempProgressVal[id] = currentProgressArray;
            let totalBytes = 0;
            for (let i = 0; i < currentProgressArray.length; i++) {
                totalBytes += currentProgressArray[i];
            }

            this.totalBytesUploadedObject$$.next(tempProgressVal);
        });

        return mediaObject.promise();
    }

    pauseUpload() {
        this.mediaObjects.forEach((mediaObject) => {
            mediaObject.abort();
        });
    }

    getBytesUploaded() {
        this.totalBytesUploadedObject$$.subscribe((val) => {
            let totlBytes = (accumulator, val) => accumulator + val;
            this.totalBytesUploaded$$.next(val.reduce(totlBytes));
        });
    }
}

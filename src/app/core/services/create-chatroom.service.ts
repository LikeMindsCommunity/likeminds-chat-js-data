/**
 * @class CreateChatroom (chat, event, poll)
 * @description Contains services related to chatroom, event, poll
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { BaseService } from './base.service';
import {
    FETCH_CHATROOM_API,
    CHATROOM_RENAME,
    CREATE_POLL,
    CHATROOM_CREATE,
    CHATROOM_UPLOAD_FILES,
    UPLOAD_FILES,
    CHATROOM_DELETE,
    CHATROOM_ENABLE_MEMBER_MESSAGE,
    CHATROOM_SECRET_ADD,
    CHATROOM_SECRET_LEAVE,
} from '../../shared/constants/api.constant';
import { State } from '../../shared/store/reducers';
import { environment } from '../../../environments/environment';
import { AwsS3BucketService } from './aws-s3-bucket.service';

@Injectable({
    providedIn: 'root',
})
export class CreateChatroomService extends BaseService {
    indexCount: number;
    filesCounts: any;
    uploadMediaStatus$$: any = new BehaviorSubject('');
    downloadURL: Observable<string>;
    obj: any = [];

    constructor(
        private httpClient: HttpClient,
        private store: Store<State>,
        private afStorage: AngularFireStorage,
        private awsS3Bucket: AwsS3BucketService
    ) {
        super(httpClient);
    }

    /**
     * @function chatRoom/EventRoom
     * @param params
     * @description Service to create a new chatroom
     */
    chatRoom(params: any): Observable<any> {
        return this.post(params, null, CHATROOM_CREATE);
    }

    /**
     * @function pollRoom
     * @param params
     * @description Service to create a new chatroom
     */
    pollRoom(params: any): Observable<any> {
        return this.post(params, null, CREATE_POLL);
    }

    /**
     * @function enableMemberMsg
     * @param params
     * @description Service to enable member message
     */
    enableMemberMsg(params: any): Observable<any> {
        return this.post(params, null, CHATROOM_ENABLE_MEMBER_MESSAGE);
    }

    /**
     * @function deleteChatroom
     * @param params
     * @description Service to delete a new chatroom
     */
    deleteChatroom(params: any): Observable<any> {
        return this.post(params, null, CHATROOM_DELETE);
    }

    /**
     * @function renameChatRoom
     * @param params
     * @description Service to create a new chatroom
     */
    renameChatRoom(params: any): Observable<any> {
        return this.post(params, null, CHATROOM_RENAME);
    }

    /**
     * @function uploadFiles
     * @description Service to upload chatroom files
     */
    uploadFiles(params: any): Observable<any> {
        return this.post(params, null, CHATROOM_UPLOAD_FILES);
    }

    /**
     * @function getChatroomDetail
     * @description Service to fetch chatroom detail
     */
    getChatroomDetail(chatroom_id: any): Observable<any> {
        const queryParams = { chatroom_id: chatroom_id };
        return this.get(queryParams, FETCH_CHATROOM_API);
    }

    /**
     * @function addParticipants
     * @description Service to add participants into the chatroom
     */
    addParticipants(params: any): Observable<any> {
        return this.post(params, null, CHATROOM_SECRET_ADD);
    }

    /**
     * @function removeParticipants
     * @description Service to remove participant from chatroom
     */
    removeParticipants(params: any): Observable<any> {
        return this.post(params, null, CHATROOM_SECRET_LEAVE);
    }

    /**
     * @function uploadMemberImage
     * @description Service to edit member image
     */

    getFileUrl(params: any): Observable<any> {
        const path = `/files/collabcard/${params.chatRoomId}`;
        return this.get(params, path);
    }

    uploadToFirebase(file, chatroom_id, index?: any): any {
        const filePath = `files/collabcard/${chatroom_id}/conversation/5000/${file.name}`;
        const fileRef = this.afStorage.ref(filePath);
        const task = this.afStorage.upload(filePath, file);
        return fileRef.getDownloadURL();
    }

    uploadFile(fileObje, chatroom_id, indexNumber) {
        const filePath = `files/collabcard/${chatroom_id}/conversation/${fileObje.fileName}`;
        let imgObject = this.awsS3Bucket
            .getAWS()
            .upload({
                Key: `files/collabcard/${chatroom_id}/conversation/${fileObje.fileName}`,
                Bucket: environment.awsBucket,
                Body: fileObje.file,
                ACL: 'public-read-write',
                ContentType: fileObje.type,
            })
            .promise();

        from(imgObject).subscribe((url: any) => {
            const data = {
                chatroom_id: chatroom_id,
                url: url.Location,
                thumnail_url: url.Location,
                type: fileObje.type, // fileObje.type.split('/')[0] != 'application' ? fileObje.type.split('/')[0] : 'pdf',
                index: indexNumber,
                meta: fileObje?.meta,
                name: fileObje?.fileName,
            };
            this.post(data, null, UPLOAD_FILES).subscribe((resData3) => {
                if (this.filesCounts === indexNumber) return this.uploadMediaStatus$$.next('media uploaded successfully');
            });
        });
    }

    uploadMedia(files: any, chatRoomId: number): any {
        this.filesCounts = files.length - 1;
        files.forEach((file, indexNumber) => {
            this.uploadFile(file, chatRoomId, indexNumber);
        });
    }
}

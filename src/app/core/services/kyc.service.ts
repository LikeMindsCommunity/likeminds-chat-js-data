import { from } from 'rxjs';
import { environment } from './../../../environments/environment';
import { AwsS3BucketService } from './aws-s3-bucket.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KYCService {

    constructor(private http: HttpClient, private awsS3Bucket: AwsS3BucketService) {}

    createKYC(payload){
        return this.http.post(`/subscription/kyc/create`, payload)
    }

    fetchKYC(id){
        return this.http.get(`/subscription/kyc/fetch?community_id=${id}`)
    }

    UploadFile(upload_url: string, file, community_id: string) {
        return new Promise((resolve, reject) => {
            let imgObject = this.awsS3Bucket
                .getAWS()
                .upload({
                    Key: `files/kyc/${community_id}/${upload_url}`,
                    Bucket: environment.awsBucket,
                    Body: file,
                    ACL: 'public-read-write',
                    ContentType: file.type,
                })
                .promise();

            from(imgObject).subscribe((file_url: any) => {
                resolve(file_url.Location);
            });
        });
    }

}

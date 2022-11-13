import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { environment } from 'src/environments/environment';
import { LinkedinServices } from 'src/app/core/services/linkedin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from "rxjs";
import { SocialAuthService } from "angularx-social-login";
import { STORAGE_KEY } from "src/app/shared/enums/storage-keys.enum";

@Component({
    selector: 'linkedin-button',
    templateUrl: './linkedin-button.component.html'
})

export class LinkedinButtonComponent implements OnInit {
    @Output() lnUserData = new EventEmitter<Object>();
    userData: any;

    linkedInCredentials = {
        clientId: environment.social.linkedinKey,
        clientSecret: environment.social.linkedinSecret,
        redirectUrl: environment.social.redirect_uri
        // redirectUrl: ""
    };
    constructor(
        private linkedinService: LinkedinServices,
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(response => {
            if (response['code']) this.linkedinService.getLinkedinAccessToken({
                grant_type: 'authorization_code',
                code: response['code'],
                redirect_uri: this.linkedInCredentials.redirectUrl,
                client_id: this.linkedInCredentials.clientId,
                client_secret: this.linkedInCredentials.clientSecret,
                type: 'linkedin_web'
            }).subscribe((response: any) => {
                this.lnUserData.emit(response);
            });
        })
    }
    login() {
        window.location.href = 'https://www.linkedin.com/oauth/v2/authorization?response_type=code&state=987654321&scope=r_liteprofile%20r_emailaddress&client_id=' + this.linkedInCredentials.clientId + '&redirect_uri=' + this.linkedInCredentials.redirectUrl;
    }
}
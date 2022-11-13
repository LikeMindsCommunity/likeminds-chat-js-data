import { Component } from "@angular/core";
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider } from "angularx-social-login";

@Component({
    selector: 'facebook-button',
    templateUrl: './facebook-button.component.html'
})

export class FacebookButtonComponent {
    constructor(private socialAuthService: SocialAuthService) { }

    signInWithFacebook(): void {
        this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
}
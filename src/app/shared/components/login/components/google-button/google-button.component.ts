import { Component } from "@angular/core";
import { SocialAuthService } from "angularx-social-login";
import { GoogleLoginProvider } from "angularx-social-login";

@Component({
    selector: 'google-button',
    templateUrl: './google-button.component.html'
})

export class GoogleButtonComponent {
    constructor(private socialAuthService: SocialAuthService) { }

    signInWithGoogle(): void {
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    }
}
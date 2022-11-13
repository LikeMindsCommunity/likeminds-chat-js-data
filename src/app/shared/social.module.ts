import { NgModule } from '@angular/core';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
    GoogleLoginProvider,
    FacebookLoginProvider,
} from 'angularx-social-login';
import { environment } from 'src/environments/environment';

const googleLoginOptions = {
    scope: 'profile email'
};

@NgModule({
    imports: [
        SocialLoginModule
    ],
    exports: [
        SocialLoginModule
    ],
    providers: [
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(environment.social.googleClientId, googleLoginOptions),
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider(environment.social.facebookAppId),
                    }
                ],
            } as SocialAuthServiceConfig,
        }
    ]
})
export class SocialModule { }
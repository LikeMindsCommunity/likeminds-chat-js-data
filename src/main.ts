import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import * as mixpanel from 'mixpanel-browser';

if (environment.production) {
    enableProdMode();
    if (window) {
        window.console.log = function () {};
        window.console.warn = function () {};
        window.console.error = function () {};
    }
} else {
    // if (window) {
    //     window.console.log = function () {};
    //     window.console.warn = function () {};
    //     window.console.error = function () {};
    // }
}

mixpanel.init(environment.mixpanelToken, { debug: false });
mixpanel.init(environment.segMentKey, { debug: false });

document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .catch((err) => console.error(err));
});

import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../services/localstorage.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { STORAGE_KEY } from 'src/app/shared/enums/storage-keys.enum';
import { AUTH_PATH, CM_HOME_PATH } from 'src/app/shared/constants/routes.constant';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(
        private snackbar: MatSnackBar,
        private localStorageService: LocalStorageService,
        private router: Router,
        private auth: AuthService
    ) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                //access_token expired
                if (error.status === 401 && error.error?.error_message === 'Invalid LTM!') {
                    return this.auth.refreshToken().pipe(
                        switchMap((response) => {
                            if (response.success) {
                                const {
                                    data: { access_token, refresh_token },
                                } = response;
                                this.localStorageService.setSavedState({ access_token }, STORAGE_KEY.ACCESS_TOKEN_LTM);
                                this.localStorageService.setSavedState({ refresh_token }, STORAGE_KEY.REFRESH_TOKEN_RTM);
                                request = request.clone({
                                    headers: request.headers.set(
                                        'Authorization',
                                        `Bearer ${this.localStorageService.getSavedState(STORAGE_KEY.ACCESS_TOKEN_LTM)?.access_token}`
                                    ),
                                });

                                return next.handle(request);
                            }
                            return throwError(() => new Error(error.error));
                        })
                    );
                }
                //refresh_token expired
                else if (error.status === 401 && error.error?.error_message === 'Invalid RTM!') {
                    localStorage.clear();
                    this.router.navigate([`/${AUTH_PATH}`]);
                }
                //No project found redirect
                else if (error.status === 500 && error.error?.error_message === 'No projects found') {
                    this.router.navigate([`/${CM_HOME_PATH}`], {
                        queryParams: {
                            new_user: true,
                        },
                    });
                }
                // this.snackbar.open(error.status === 0 ? error.message : error.error?.error_message, 'Close', {
                //     duration: 5000,
                //     panelClass: ['error-alert-snackbar'],
                //     horizontalPosition: 'right',
                // });
                else return throwError(() => error);
            })
        );
    }
}

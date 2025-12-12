import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertService } from '../services/shared/alert/alert.service';
import { UtilsService } from '../services/shared/utils/utils.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private router = inject(Router);
    private utils = inject(UtilsService);
    private alertService = inject(AlertService)

    canActivate(): boolean {
        const token = this.utils.getToken();

        if (!token) {
            this.utils.logout();
            this.alertService.error('Login to continue!', "You don't have an active session")
            this.router.navigate(['/auth/login']);
            return false;
        }

        return true;
    }
}

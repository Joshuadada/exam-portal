import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AlertService } from '../services/shared/alert/alert.service';
import { UtilsService } from '../services/shared/utils/utils.service';

@Injectable({
    providedIn: 'root'
})
export class StudentAuthGuard implements CanActivate {
    private router = inject(Router);
    private utils = inject(UtilsService);
    private alertService = inject(AlertService)
    private user = JSON.parse(localStorage.getItem('user') || "{}")

    canActivate(): boolean {
        const token = this.utils.getToken();
        const role: 'student' | 'examiner' = this.user?.role

        if (!token) {
            this.utils.logout();
            this.alertService.error('Login to continue!', "You don't have an active session")
            this.router.navigate(['/login']);
            return false;
        }

        if(role != 'student'){
            this.utils.logout();
            this.alertService.error('Login to continue!', "You are not logged in as a student")
            this.router.navigate(['/login']);
            return false;
        }

        return true;
    }
}

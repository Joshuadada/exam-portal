import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { LoaderInterceptor } from './core/interceptors/loader.interceptor';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        closeButton: true,
        progressBar: true,
        timeOut: 3000,
        preventDuplicates: true,
        maxOpened: 1,
        autoDismiss: true
      })
    ),
    provideHttpClient(
      withInterceptors([
        LoaderInterceptor,
        AuthInterceptor,
        ErrorInterceptor
      ])
    ),
  ]
};